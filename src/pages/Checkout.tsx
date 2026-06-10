import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  AlertCircle,
  Check,
  ChevronRight,
  FileCheck,
  Loader,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Upload,
  X,
} from 'lucide-react'
import { useCart, type PendingDocuments } from '../context/CartContext'
import {
  cartAttributesUpdate,
  cartBuyerIdentityUpdate,
  cartNoteUpdate,
  type Attribute,
  type Cart,
} from '../lib/shopify'

const C = {
  bgVoid: '#050401',
  bgSurface: '#111111',
  bgPanel: '#0d0d0d',
  textPrimary: '#f2f3f4',
  textMuted: '#757575',
  accentGold: '#ffd700',
  accentGoldGlow: 'rgba(255, 215, 0, 0.15)',
  borderSubtle: '#222222',
  alertRed: '#d9534f',
  successGreen: '#4f8a4f',
} as const

interface CustomerDetails {
  fullName: string
  email: string
  phone: string
  address1: string
  address2: string
  city: string
  postcode: string
  country: string
}

interface UploadedDocument {
  key: string
  label: string
  fileName: string
  url: string
  publicId: string
}

type Step = 'details' | 'review'
type ErrorMap = Partial<Record<string, string>>

const emptyCustomer: CustomerDetails = {
  fullName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  postcode: '',
  country: 'United Kingdom',
}

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
})

function formatMoney(amount: string | number) {
  const value = typeof amount === 'number' ? amount : Number.parseFloat(amount)
  return currencyFormatter.format(Number.isFinite(value) ? value : 0)
}

function titleCase(value: string) {
  return value
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function attrValue(attrs: Attribute[], key: string) {
  return attrs.find((attr) => attr.key.toLowerCase() === key.toLowerCase())?.value
}

function isRoadLegalCart(cart: Cart | null) {
  if (!cart) return false
  return cart.lines.nodes.some((line) => {
    const type = attrValue(line.attributes, '_plate_type') || attrValue(line.attributes, 'Type')
    return (
      type?.toUpperCase().includes('ROAD LEGAL') ||
      line.merchandise.product.title.toUpperCase().includes('ROAD LEGAL')
    )
  })
}

function collectCartMetadata(cart: Cart) {
  const registrations = new Set<string>()
  const plateTypes = new Set<string>()
  const notes = new Set<string>()

  cart.lines.nodes.forEach((line) => {
    const registration =
      attrValue(line.attributes, '_registration') ||
      attrValue(line.attributes, 'Registration') ||
      attrValue(line.attributes, 'Text')
    const type = attrValue(line.attributes, '_plate_type') || attrValue(line.attributes, 'Type')
    const note = attrValue(line.attributes, '_customer_notes') || attrValue(line.attributes, 'Notes')

    if (registration) registrations.add(registration)
    if (type) plateTypes.add(type)
    if (note) notes.add(note)
  })

  return {
    registrations: Array.from(registrations).join(', '),
    plateTypes: Array.from(plateTypes).join(', '),
    notes: Array.from(notes).join(' | '),
  }
}

type CartLineNode = Cart['lines']['nodes'][number]

const REVIEW_ATTRIBUTE_ORDER = [
  '_registration',
  '_plate_type',
  '_plate_style',
  '_configuration',
  '_customer_notes',
  'Registration',
  'Text',
  'Type',
  'Style',
  'Configuration',
  'Plate Style',
  'Holder Qty',
  'Badge',
  'Side Text',
  'Notes',
]

function orderedReviewAttributes(line: CartLineNode) {
  const keys = new Set(REVIEW_ATTRIBUTE_ORDER.map((key) => key.toLowerCase()))
  const ordered = REVIEW_ATTRIBUTE_ORDER.flatMap((key) => {
    const value = attrValue(line.attributes, key)
    return value ? [{ key, value }] : []
  })
  const remaining = line.attributes.filter(
    (attr) => attr.value && !keys.has(attr.key.toLowerCase())
  )
  return [...ordered, ...remaining]
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function uploadDocument(file: File, key: string, label: string) {
  const fileData = await fileToBase64(file)
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 30_000)

  try {
    const res = await fetch('/api/upload-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileData,
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const isJson = res.headers
        .get('content-type')
        ?.toLowerCase()
        .includes('application/json')
      const body = isJson
        ? ((await res.json().catch(() => ({}))) as { error?: string })
        : {}
      const fallback =
        res.status === 404
          ? 'Document upload API is not available on the current dev server'
          : `Document upload failed (${res.status})`
      throw new Error(body.error || fallback)
    }

    const result = (await res.json()) as { url: string; publicId: string }
    return {
      key,
      label,
      fileName: file.name,
      url: result.url,
      publicId: result.publicId,
    } satisfies UploadedDocument
  } finally {
    window.clearTimeout(timeout)
  }
}

function buildCartAttributes(
  cart: Cart,
  customer: CustomerDetails,
  documentsRequired: boolean,
  uploadedDocuments: UploadedDocument[]
) {
  const metadata = collectCartMetadata(cart)
  const attributes: Attribute[] = [
    { key: 'checkout_stage', value: 'pre_shopify_complete' },
    { key: 'customer_name', value: customer.fullName.trim() },
    { key: 'customer_email', value: customer.email.trim() },
    { key: 'customer_phone', value: customer.phone.trim() },
    { key: 'shipping_address_1', value: customer.address1.trim() },
    { key: 'shipping_city', value: customer.city.trim() },
    { key: 'shipping_postcode', value: customer.postcode.trim().toUpperCase() },
    { key: 'shipping_country', value: customer.country.trim() },
    {
      key: 'dvla_documents_required',
      value: documentsRequired ? 'yes' : 'no',
    },
  ]

  if (customer.address2.trim()) {
    attributes.push({ key: 'shipping_address_2', value: customer.address2.trim() })
  }
  if (metadata.registrations) {
    attributes.push({ key: 'registrations', value: metadata.registrations })
  }
  if (metadata.plateTypes) {
    attributes.push({ key: 'plate_types', value: metadata.plateTypes })
  }
  if (metadata.notes) {
    attributes.push({ key: 'customer_notes', value: metadata.notes })
  }

  uploadedDocuments.forEach((document) => {
    attributes.push(
      { key: `${document.key}_url`, value: document.url },
      { key: `${document.key}_file_name`, value: document.fileName },
      { key: `${document.key}_cloudinary_id`, value: document.publicId },
      { key: `${document.label} URL`, value: document.url },
      { key: `${document.label} file name`, value: document.fileName }
    )
  })

  return attributes
}

function buildCartNote(
  cart: Cart,
  customer: CustomerDetails,
  documentsRequired: boolean,
  uploadedDocuments: UploadedDocument[]
) {
  const metadata = collectCartMetadata(cart)
  const lines = cart.lines.nodes.map((line) => {
    const attrs = orderedReviewAttributes(line)
      .map((attr) => `${attr.key}: ${attr.value}`)
      .join('; ')
    return `- ${line.quantity}x ${line.merchandise.product.title}${attrs ? ` (${attrs})` : ''}`
  })
  const documents = uploadedDocuments.length
    ? uploadedDocuments.map((document) => `${document.label}: ${document.url} (${document.fileName})`)
    : ['No documents uploaded on this order.']

  return [
    'Punjabi Number Plates pre-checkout details',
    `Customer: ${customer.fullName.trim()}`,
    `Email: ${customer.email.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Address: ${[customer.address1, customer.address2, customer.city, customer.postcode, customer.country]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(', ')}`,
    `DVLA documents required: ${documentsRequired ? 'yes' : 'no'}`,
    metadata.registrations ? `Registration(s): ${metadata.registrations}` : '',
    metadata.plateTypes ? `Plate type(s): ${metadata.plateTypes}` : '',
    metadata.notes ? `Customer notes: ${metadata.notes}` : '',
    'Items:',
    ...lines,
    'Documents:',
    ...documents,
  ]
    .filter(Boolean)
    .join('\n')
    .slice(0, 4800)
}

function countryToShopifyCode(country: string) {
  return country.toLowerCase() === 'united kingdom' ? 'GB' : undefined
}

export default function Checkout() {
  const {
    cart,
    pendingDocuments,
    setPendingDocuments,
    removeLine,
    updateQuantity,
    isLoading,
  } = useCart()
  const [step, setStep] = useState<Step>('details')
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer)
  const [proofOfId, setProofOfId] = useState<File | null>(
    pendingDocuments.proofOfId
  )
  const [proofOfEntitlement, setProofOfEntitlement] = useState<File | null>(
    pendingDocuments.proofOfEntitlement
  )
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [roadLegalConfirmed, setRoadLegalConfirmed] = useState(false)
  const [errors, setErrors] = useState<ErrorMap>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const lines = cart?.lines.nodes ?? []
  const requiresDocuments = useMemo(() => isRoadLegalCart(cart), [cart])
  const documentsReady =
    !requiresDocuments || Boolean(proofOfId && proofOfEntitlement)
  const subtotal = cart?.cost.subtotalAmount.amount ?? '0'
  const total = cart?.cost.totalAmount.amount ?? subtotal

  useEffect(() => {
    setProofOfId(pendingDocuments.proofOfId)
    setProofOfEntitlement(pendingDocuments.proofOfEntitlement)
  }, [pendingDocuments])

  const updateCustomer = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const setDocument = (slot: keyof PendingDocuments, file: File | null) => {
    const next = {
      proofOfId,
      proofOfEntitlement,
      [slot]: file,
    }
    setProofOfId(next.proofOfId)
    setProofOfEntitlement(next.proofOfEntitlement)
    setPendingDocuments(next)
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy.documents
      return copy
    })
  }

  const validate = () => {
    const next: ErrorMap = {}

    if (!cart || lines.length === 0) {
      next.cart = 'Your bag is empty.'
    }
    if (!customer.fullName.trim()) next.fullName = 'Full name is required'
    if (!customer.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      next.email = 'Enter a valid email address'
    }
    if (!customer.phone.trim()) next.phone = 'Phone number is required'
    if (!customer.address1.trim()) next.address1 = 'Address is required'
    if (!customer.city.trim()) next.city = 'Town or city is required'
    if (!customer.postcode.trim()) next.postcode = 'Postcode is required'

    if (requiresDocuments && !documentsReady) {
      next.documents = 'Upload both proof of identification and proof of entitlement'
    }
    if (!termsAccepted) next.terms = 'Accept the terms before continuing'
    if (requiresDocuments && !roadLegalConfirmed) {
      next.roadLegal = 'Confirm this road legal plate order is DVLA compliant'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const continueToReview = () => {
    if (validate()) {
      setStep('review')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const continueToShopify = async () => {
    if (!cart || !validate()) return

    setIsSubmitting(true)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.submit
      return next
    })

    try {
      const uploads: Promise<UploadedDocument>[] = []
      if (requiresDocuments) {
        if (proofOfId) uploads.push(uploadDocument(proofOfId, 'proof_of_id', 'Proof of ID'))
        if (proofOfEntitlement) {
          uploads.push(
            uploadDocument(
              proofOfEntitlement,
              'proof_of_entitlement',
              'Proof of Entitlement'
            )
          )
        }
      }

      const uploadedDocuments = await Promise.all(uploads)
      let updatedCart = await cartAttributesUpdate(
        cart.id,
        buildCartAttributes(cart, customer, requiresDocuments, uploadedDocuments)
      )
      updatedCart = await cartNoteUpdate(
        updatedCart.id,
        buildCartNote(cart, customer, requiresDocuments, uploadedDocuments)
      )

      try {
        updatedCart = await cartBuyerIdentityUpdate(cart.id, {
          email: customer.email.trim(),
          phone: customer.phone.trim(),
          countryCode: countryToShopifyCode(customer.country),
        })
      } catch (err) {
        console.error('Shopify buyer identity update failed:', err)
      }

      window.location.assign(updatedCart.checkoutUrl || cart.checkoutUrl)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Checkout preparation failed. Please try again.'
      setErrors((prev) => ({ ...prev, submit: message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!cart || lines.length === 0) {
    return <EmptyCheckout />
  }

  return (
    <main
      style={{
        backgroundColor: C.bgVoid,
        minHeight: '100dvh',
        padding: '80px 24px 120px',
        color: C.textPrimary,
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <Header step={step} documentsRequired={requiresDocuments} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '28px',
            alignItems: 'start',
          }}
          className="checkout-grid"
        >
          <section style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {step === 'details' ? (
              <>
                <Panel title="1. Review Your Bag" icon={<ShoppingBag size={18} />}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {lines.map((line) => (
                      <CartLineRow
                        key={line.id}
                        line={line}
                        disabled={isLoading || isSubmitting}
                        onRemove={() => removeLine(line.id)}
                        onQuantityChange={(quantity) =>
                          updateQuantity(line.id, quantity)
                        }
                      />
                    ))}
                  </div>
                  {errors.cart && <ErrorMessage>{errors.cart}</ErrorMessage>}
                </Panel>

                <Panel title="2. Customer Details" icon={<ShieldCheck size={18} />}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '14px',
                    }}
                    className="checkout-two-col"
                  >
                    <InputField
                      label="Full Name"
                      value={customer.fullName}
                      error={errors.fullName}
                      onChange={(value) => updateCustomer('fullName', value)}
                    />
                    <InputField
                      label="Email"
                      type="email"
                      value={customer.email}
                      error={errors.email}
                      onChange={(value) => updateCustomer('email', value)}
                    />
                    <InputField
                      label="Phone"
                      type="tel"
                      value={customer.phone}
                      error={errors.phone}
                      onChange={(value) => updateCustomer('phone', value)}
                    />
                    <InputField
                      label="Country"
                      value={customer.country}
                      onChange={(value) => updateCustomer('country', value)}
                    />
                    <InputField
                      label="Address Line 1"
                      value={customer.address1}
                      error={errors.address1}
                      onChange={(value) => updateCustomer('address1', value)}
                      wide
                    />
                    <InputField
                      label="Address Line 2"
                      value={customer.address2}
                      onChange={(value) => updateCustomer('address2', value)}
                      wide
                    />
                    <InputField
                      label="Town Or City"
                      value={customer.city}
                      error={errors.city}
                      onChange={(value) => updateCustomer('city', value)}
                    />
                    <InputField
                      label="Postcode"
                      value={customer.postcode}
                      error={errors.postcode}
                      onChange={(value) =>
                        updateCustomer('postcode', value.toUpperCase())
                      }
                    />
                  </div>
                </Panel>

                <Panel
                  title="3. DVLA Compliance"
                  icon={<FileCheck size={18} />}
                  muted={!requiresDocuments}
                >
                  {requiresDocuments ? (
                    <>
                      <p style={mutedText}>
                        Road legal plates require proof of identification and proof of
                        entitlement before payment. The files are attached to the
                        Shopify cart before checkout opens.
                      </p>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '14px',
                          marginTop: '14px',
                        }}
                        className="checkout-two-col"
                      >
                        <DocumentUpload
                          label="Proof Of Identification"
                          file={proofOfId}
                          onChange={(file) => setDocument('proofOfId', file)}
                        />
                        <DocumentUpload
                          label="Proof Of Entitlement"
                          file={proofOfEntitlement}
                          onChange={(file) =>
                            setDocument('proofOfEntitlement', file)
                          }
                        />
                      </div>
                      {errors.documents && (
                        <ErrorMessage>{errors.documents}</ErrorMessage>
                      )}
                    </>
                  ) : (
                    <p style={mutedText}>
                      This cart does not contain a road legal plate selection, so DVLA
                      documents are not required before Shopify checkout.
                    </p>
                  )}
                </Panel>

                <Panel title="4. Confirm And Continue" icon={<Lock size={18} />}>
                  <CheckboxRow
                    checked={termsAccepted}
                    onChange={setTermsAccepted}
                    label={
                      <>
                        I agree to the{' '}
                        <Link to="/legal" style={linkStyle}>
                          terms and privacy policy
                        </Link>
                        .
                      </>
                    }
                    error={errors.terms}
                  />
                  {requiresDocuments && (
                    <CheckboxRow
                      checked={roadLegalConfirmed}
                      onChange={setRoadLegalConfirmed}
                      label="I confirm this is a DVLA-compliant road legal plate order."
                      error={errors.roadLegal}
                    />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <PrimaryButton onClick={continueToReview}>
                      Review Order <ChevronRight size={18} />
                    </PrimaryButton>
                  </div>
                </Panel>
              </>
            ) : (
              <ReviewPanel
                cart={cart}
                customer={customer}
                requiresDocuments={requiresDocuments}
                proofOfId={proofOfId}
                proofOfEntitlement={proofOfEntitlement}
                isSubmitting={isSubmitting}
                errors={errors}
                onBack={() => setStep('details')}
                onContinue={continueToShopify}
              />
            )}
          </section>

          <OrderSummary
            subtotal={subtotal}
            total={total}
            totalQuantity={cart.totalQuantity}
            documentsReady={documentsReady}
            requiresDocuments={requiresDocuments}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 680px) {
          .checkout-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}

function EmptyCheckout() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        backgroundColor: C.bgVoid,
        color: C.textPrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: '460px', textAlign: 'center' }}>
        <ShoppingBag size={44} color={C.accentGold} />
        <h1 style={headingStyle}>Your Bag Is Empty</h1>
        <p style={{ ...mutedText, marginBottom: '24px' }}>
          Add a plate, holder, or keyring before starting checkout.
        </p>
        <Link to="/categories/number-plates" style={{ ...buttonStyle, textDecoration: 'none' }}>
          Start Shopping
        </Link>
      </div>
    </main>
  )
}

function Header({
  step,
  documentsRequired,
}: {
  step: Step
  documentsRequired: boolean
}) {
  return (
    <header style={{ marginBottom: '28px' }}>
      <p style={eyebrowStyle}>Secure Shopify Checkout</p>
      <h1 style={headingStyle}>Complete Your Order</h1>
      <p style={{ ...mutedText, maxWidth: '760px' }}>
        We collect compliance details first, attach them to your Shopify cart,
        then send you to Shopify to pay securely.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '18px',
        }}
      >
        <StatusPill active={step === 'details'}>Details</StatusPill>
        <StatusPill active={step === 'review'}>Review</StatusPill>
        <StatusPill active>Shopify Payment</StatusPill>
        {documentsRequired && <StatusPill active>DVLA Docs Required</StatusPill>}
      </div>
    </header>
  )
}

function StatusPill({
  active,
  children,
}: {
  active?: boolean
  children: ReactNode
}) {
  return (
    <span
      style={{
        border: `1px solid ${active ? C.accentGold : C.borderSubtle}`,
        color: active ? C.accentGold : C.textMuted,
        borderRadius: '9999px',
        padding: '7px 12px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  )
}

function Panel({
  title,
  icon,
  muted,
  children,
}: {
  title: string
  icon: ReactNode
  muted?: boolean
  children: ReactNode
}) {
  return (
    <section
      style={{
        backgroundColor: muted ? 'rgba(17, 17, 17, 0.45)' : C.bgPanel,
        border: `1px solid ${C.borderSubtle}`,
        borderRadius: '8px',
        padding: '22px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: C.accentGold,
          marginBottom: '16px',
        }}
      >
        {icon}
        <h2
          style={{
            color: C.textPrimary,
            fontSize: '1rem',
            fontWeight: 700,
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function CartLineRow({
  line,
  disabled,
  onRemove,
  onQuantityChange,
}: {
  line: Cart['lines']['nodes'][number]
  disabled: boolean
  onRemove: () => void
  onQuantityChange: (quantity: number) => void
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 1fr auto',
        gap: '14px',
        alignItems: 'center',
        border: `1px solid ${C.borderSubtle}`,
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: C.bgSurface,
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: C.bgVoid,
        }}
      >
        {line.merchandise.product.featuredImage?.url ? (
          <img
            src={line.merchandise.product.featuredImage.url}
            alt={line.merchandise.product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ ...centerStyle, height: '100%', color: C.textMuted }}>PNP</div>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <h3
          style={{
            margin: '0 0 5px',
            color: C.textPrimary,
            fontSize: '0.95rem',
            textTransform: 'uppercase',
          }}
        >
          {line.merchandise.product.title}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {line.attributes.map((attr) => (
            <span key={`${line.id}-${attr.key}`} style={attributePillStyle}>
              {attr.key}: {attr.value}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '10px',
        }}
      >
        <strong style={{ color: C.accentGold }}>
          {formatMoney(line.cost.totalAmount.amount)}
        </strong>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconButton
            label="Decrease quantity"
            disabled={disabled}
            onClick={() => onQuantityChange(line.quantity - 1)}
          >
            <Minus size={14} />
          </IconButton>
          <span style={{ minWidth: '24px', textAlign: 'center' }}>{line.quantity}</span>
          <IconButton
            label="Increase quantity"
            disabled={disabled}
            onClick={() => onQuantityChange(line.quantity + 1)}
          >
            <Plus size={14} />
          </IconButton>
          <IconButton label="Remove item" disabled={disabled} onClick={onRemove}>
            <X size={14} />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

function InputField({
  label,
  value,
  type = 'text',
  error,
  wide,
  onChange,
}: {
  label: string
  value: string
  type?: string
  error?: string
  wide?: boolean
  onChange: (value: string) => void
}) {
  return (
    <label style={{ display: 'block', gridColumn: wide ? '1 / -1' : undefined }}>
      <span style={labelStyle}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          ...inputStyle,
          borderColor: error ? C.alertRed : C.borderSubtle,
        }}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </label>
  )
}

function DocumentUpload({
  label,
  file,
  onChange,
}: {
  label: string
  file: File | null
  onChange: (file: File | null) => void
}) {
  return (
    <label
      style={{
        border: `2px dashed ${file ? C.successGreen : C.borderSubtle}`,
        borderRadius: '8px',
        padding: '20px',
        minHeight: '148px',
        backgroundColor: C.bgSurface,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '9px',
        cursor: 'pointer',
        textAlign: 'center',
      }}
    >
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        style={{ display: 'none' }}
      />
      {file ? (
        <>
          <FileCheck size={24} color={C.successGreen} />
          <strong style={{ color: C.successGreen, fontSize: '0.85rem' }}>
            {file.name}
          </strong>
          <span style={mutedText}>Click to replace</span>
        </>
      ) : (
        <>
          <Upload size={24} color={C.textMuted} />
          <strong style={{ color: C.textPrimary, fontSize: '0.85rem' }}>{label}</strong>
          <span style={mutedText}>PDF, JPG, or PNG under 10 MB</span>
        </>
      )}
    </label>
  )
}

function CheckboxRow({
  checked,
  label,
  error,
  onChange,
}: {
  checked: boolean
  label: ReactNode
  error?: string
  onChange: (checked: boolean) => void
}) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          width: '100%',
          border: 'none',
          background: 'transparent',
          color: C.textMuted,
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            ...centerStyle,
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: `2px solid ${error ? C.alertRed : checked ? C.accentGold : C.borderSubtle}`,
            backgroundColor: checked ? C.accentGold : 'transparent',
            flexShrink: 0,
          }}
        >
          {checked && <Check size={14} color={C.bgVoid} strokeWidth={3} />}
        </span>
        <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{label}</span>
      </button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

function ReviewPanel({
  cart,
  customer,
  requiresDocuments,
  proofOfId,
  proofOfEntitlement,
  isSubmitting,
  errors,
  onBack,
  onContinue,
}: {
  cart: Cart
  customer: CustomerDetails
  requiresDocuments: boolean
  proofOfId: File | null
  proofOfEntitlement: File | null
  isSubmitting: boolean
  errors: ErrorMap
  onBack: () => void
  onContinue: () => void
}) {
  const metadataItems = cart.lines.nodes.map((line) => ({
    line,
    attributes: orderedReviewAttributes(line),
  }))

  return (
    <Panel title="Final Review" icon={<Lock size={18} />}>
      <div style={{ display: 'grid', gap: '16px' }}>
        <ReviewBlock title="Customer">
          <p style={reviewLineStyle}>{customer.fullName}</p>
          <p style={reviewLineStyle}>{customer.email}</p>
          <p style={reviewLineStyle}>{customer.phone}</p>
          <p style={reviewLineStyle}>
            {[customer.address1, customer.address2, customer.city, customer.postcode]
              .filter(Boolean)
              .join(', ')}
          </p>
        </ReviewBlock>

        <ReviewBlock title="Cart Selections">
          <div style={{ display: 'grid', gap: '12px' }}>
            {metadataItems.map(({ line, attributes }) => (
              <MetadataItemSummary
                key={line.id}
                line={line}
                attributes={attributes}
                requiresDocuments={requiresDocuments}
              />
            ))}
          </div>
        </ReviewBlock>

        <ReviewBlock title="DVLA Documents">
          {requiresDocuments ? (
            <div style={{ display: 'grid', gap: '8px' }}>
              <DocumentSummary label="Proof of ID" file={proofOfId} />
              <DocumentSummary
                label="Proof of entitlement"
                file={proofOfEntitlement}
              />
            </div>
          ) : (
            <p style={reviewLineStyle}>No DVLA documents required.</p>
          )}
        </ReviewBlock>

        <div
          style={{
            border: `1px solid ${C.borderSubtle}`,
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: C.bgSurface,
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <Lock size={18} color={C.accentGold} style={{ flexShrink: 0 }} />
          <p style={{ ...mutedText, margin: 0 }}>
            Payment, shipping rates, and final order confirmation happen inside
            Shopify checkout. We do not store card details on this site.
          </p>
        </div>

        {errors.submit && (
          <div
            style={{
              border: `1px solid ${C.alertRed}`,
              borderRadius: '8px',
              padding: '12px',
              color: C.alertRed,
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <AlertCircle size={18} />
            {errors.submit}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <SecondaryButton onClick={onBack}>Back To Details</SecondaryButton>
          <PrimaryButton onClick={onContinue} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader size={18} className="checkout-spin" />
                Preparing Shopify Checkout
              </>
            ) : (
              <>
                Continue To Shopify <ChevronRight size={18} />
              </>
            )}
          </PrimaryButton>
        </div>
      </div>
      <style>{`
        .checkout-spin {
          animation: checkout-spin 1s linear infinite;
        }
        @keyframes checkout-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Panel>
  )
}

function ReviewBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        border: `1px solid ${C.borderSubtle}`,
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: C.bgSurface,
      }}
    >
      <h3 style={{ margin: '0 0 8px', color: C.textPrimary, fontSize: '0.9rem' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function MetadataItemSummary({
  line,
  attributes,
  requiresDocuments,
}: {
  line: CartLineNode
  attributes: Attribute[]
  requiresDocuments: boolean
}) {
  const fallbackType = requiresDocuments ? 'ROAD LEGAL' : 'SHOW / ACCESSORY'

  return (
    <div
      style={{
        border: `1px solid ${C.borderSubtle}`,
        borderRadius: '6px',
        padding: '12px',
        backgroundColor: C.bgPanel,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '8px',
          color: C.textPrimary,
          fontSize: '0.9rem',
          fontWeight: 700,
        }}
      >
        <span>{line.merchandise.product.title}</span>
        <span style={{ color: C.textMuted, whiteSpace: 'nowrap' }}>
          Qty {line.quantity}
        </span>
      </div>
      {attributes.length > 0 ? (
        <dl style={{ display: 'grid', gap: '6px', margin: 0 }}>
          {attributes.map((attr) => (
            <div
              key={`${line.id}-${attr.key}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '130px minmax(0, 1fr)',
                gap: '10px',
                alignItems: 'baseline',
              }}
            >
              <dt style={{ color: C.textMuted, fontSize: '0.85rem' }}>
                {titleCase(attr.key)}
              </dt>
              <dd style={{ ...reviewLineStyle, margin: 0 }}>
                {attr.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p style={reviewLineStyle}>Plate type: {fallbackType}</p>
      )}
    </div>
  )
}

function DocumentSummary({
  label,
  file,
}: {
  label: string
  file: File | null
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '170px minmax(0, 1fr)',
        gap: '10px',
        alignItems: 'baseline',
      }}
    >
      <span style={{ color: C.textMuted, fontSize: '0.9rem' }}>{label}</span>
      <span
        style={{
          ...reviewLineStyle,
          color: file ? C.textPrimary : C.alertRed,
          overflowWrap: 'anywhere',
        }}
      >
        {file?.name || 'Missing'}
      </span>
    </div>
  )
}

function OrderSummary({
  subtotal,
  total,
  totalQuantity,
  documentsReady,
  requiresDocuments,
}: {
  subtotal: string
  total: string
  totalQuantity: number
  documentsReady: boolean
  requiresDocuments: boolean
}) {
  return (
    <aside
      style={{
        border: `1px solid ${C.borderSubtle}`,
        borderRadius: '8px',
        padding: '22px',
        backgroundColor: C.bgPanel,
        position: 'sticky',
        top: '126px',
      }}
    >
      <h2
        style={{
          margin: '0 0 18px',
          color: C.textPrimary,
          textTransform: 'uppercase',
          fontSize: '1rem',
        }}
      >
        Order Summary
      </h2>
      <SummaryLine label="Items" value={String(totalQuantity)} />
      <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
      <SummaryLine label="Estimated Total" value={formatMoney(total)} strong />
      <div
        style={{
          borderTop: `1px solid ${C.borderSubtle}`,
          marginTop: '18px',
          paddingTop: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <CheckLine active>Shopify secure payment</CheckLine>
        <CheckLine active={!requiresDocuments || documentsReady}>
          {requiresDocuments ? 'DVLA documents ready' : 'No documents required'}
        </CheckLine>
        <CheckLine active>Cart metadata attached before payment</CheckLine>
      </div>
    </aside>
  )
}

function SummaryLine({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: strong ? C.textPrimary : C.textMuted,
        fontWeight: strong ? 700 : 400,
        marginBottom: '10px',
      }}
    >
      <span>{label}</span>
      <span style={{ color: strong ? C.accentGold : undefined }}>{value}</span>
    </div>
  )
}

function CheckLine({
  active,
  children,
}: {
  active?: boolean
  children: ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        color: active ? C.successGreen : C.textMuted,
        fontSize: '0.85rem',
      }}
    >
      <Check size={15} />
      {children}
    </div>
  )
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...buttonStyle,
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...buttonStyle,
        backgroundColor: 'transparent',
        border: `1px solid ${C.textMuted}`,
        color: C.textPrimary,
      }}
    >
      {children}
    </button>
  )
}

function IconButton({
  label,
  children,
  disabled,
  onClick,
}: {
  label: string
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        ...centerStyle,
        width: '30px',
        height: '30px',
        borderRadius: '4px',
        border: `1px solid ${C.borderSubtle}`,
        backgroundColor: C.bgPanel,
        color: C.textPrimary,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}

function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p style={{ color: C.alertRed, fontSize: '0.8rem', margin: '7px 0 0' }}>
      {children}
    </p>
  )
}

const headingStyle: CSSProperties = {
  color: C.textPrimary,
  fontSize: 'clamp(2rem, 5vw, 4rem)',
  lineHeight: 1,
  margin: '0 0 12px',
  textTransform: 'uppercase',
}

const eyebrowStyle: CSSProperties = {
  color: C.accentGold,
  fontSize: '0.8rem',
  fontWeight: 700,
  margin: '0 0 10px',
  textTransform: 'uppercase',
}

const labelStyle: CSSProperties = {
  display: 'block',
  color: C.textMuted,
  fontSize: '0.75rem',
  fontWeight: 700,
  marginBottom: '7px',
  textTransform: 'uppercase',
}

const inputStyle: CSSProperties = {
  width: '100%',
  border: `1px solid ${C.borderSubtle}`,
  borderRadius: '8px',
  backgroundColor: C.bgSurface,
  color: C.textPrimary,
  padding: '13px 14px',
  outline: 'none',
}

const mutedText: CSSProperties = {
  color: C.textMuted,
  fontSize: '0.9rem',
  lineHeight: 1.6,
  margin: 0,
}

const buttonStyle: CSSProperties = {
  border: 'none',
  borderRadius: '9999px',
  backgroundColor: C.accentGold,
  color: C.bgVoid,
  padding: '14px 22px',
  fontWeight: 700,
  textTransform: 'uppercase',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
}

const linkStyle: CSSProperties = {
  color: C.accentGold,
}

const centerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const attributePillStyle: CSSProperties = {
  border: `1px solid ${C.borderSubtle}`,
  borderRadius: '4px',
  color: C.textMuted,
  fontSize: '0.7rem',
  padding: '2px 6px',
}

const reviewLineStyle: CSSProperties = {
  ...mutedText,
  marginBottom: '4px',
}
