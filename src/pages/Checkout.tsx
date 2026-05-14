import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  Check,
  Upload,
  Lock,
  Zap,
  CreditCard,
  Loader,
  ChevronRight,
  Award,
  Clock,
  Instagram,
  Facebook,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                       */
/* ------------------------------------------------------------------ */
const C = {
  bgVoid: '#050401',
  bgSurface: '#111111',
  textPrimary: '#f2f3f4',
  textMuted: '#757575',
  accentGold: '#ffd700',
  accentGoldDim: '#b8860b',
  accentGoldGlow: 'rgba(255, 215, 0, 0.15)',
  borderSubtle: '#222222',
  alertRed: '#d9534f',
  successGreen: '#4f8a4f',
} as const

const _easeSmooth = 'cubic-bezier(0.23, 1, 0.32, 1)'
const _easeExpoOut = 'cubic-bezier(0.16, 1, 0.3, 1)'
void _easeSmooth
void _easeExpoOut

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */
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

interface CardDetails {
  number: string
  expiryMonth: string
  expiryYear: string
  cvc: string
  name: string
}

type PlateConfig = 'front-rear' | 'front-only' | 'rear-only'
type PlateType = 'road-legal' | 'show-plate'
type DeliveryMethod = 'standard' | 'express'
type PaymentMethod = 'card' | 'paypal' | 'clearpay'
type Step = 1 | 2 | 3 | 4

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */
function isValidUKRegistration(reg: string): boolean {
  const clean = reg.replace(/\s/g, '').toUpperCase()
  if (clean.length < 2 || clean.length > 7) return false
  // Current format: 2 letters + 2 digits + 3 letters
  const currentFormat = /^[A-Z]{2}\d{2}[A-Z]{3}$/
  // Prefix format: 1-3 letters + 1-3 digits + 3 letters
  const prefixFormat = /^[A-Z]{1,3}\d{1,3}[A-Z]{3}$/
  // Suffix format: 3 letters + 1-3 digits + 1-3 letters
  const suffixFormat = /^[A-Z]{3}\d{1,3}[A-Z]{1,3}$/
  // Dateless: 1-3 letters + 1-4 numbers (or vice versa)
  const datelessFormat = /^([A-Z]{1,3}\d{1,4}|\d{1,4}[A-Z]{1,3})$/
  return (
    currentFormat.test(clean) ||
    prefixFormat.test(clean) ||
    suffixFormat.test(clean) ||
    datelessFormat.test(clean)
  )
}

function getConfigPrice(config: PlateConfig): number {
  if (config === 'front-rear') return 59.99
  return 34.99
}

function formatCardNumber(v: string): string {
  return v
    .replace(/\s/g, '')
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

/* ------------------------------------------------------------------ */
/*  CHECKOUT PAGE                                                       */
/* ------------------------------------------------------------------ */
export default function Checkout() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  /* -- Step state -- */
  const [step, setStep] = useState<Step>(1)

  /* -- Step 1 state -- */
  const [registration, setRegistration] = useState('')
  const [plateConfig, setPlateConfig] = useState<PlateConfig>('front-rear')
  const [plateType, setPlateType] = useState<PlateType>('road-legal')
  const [notes, setNotes] = useState('')

  /* -- Step 2 state -- */
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  })
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('standard')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  /* -- Step 3 state -- */
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
  })
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [billingAddress, setBillingAddress] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [roadLegalConfirmed, setRoadLegalConfirmed] = useState(false)

  /* -- Submit state -- */
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  /* -- Validation errors -- */
  const [errors, setErrors] = useState<Record<string, string>>({})

  /* -- File input ref -- */
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* -- GSAP entrance animations -- */
  useGSAP(
    () => {
      if (step !== 4) {
        gsap.fromTo(
          '.checkout-step-content',
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          }
        )
      }
    },
    { scope: containerRef, dependencies: [step] }
  )

  /* -- Confirmation animation -- */
  useGSAP(
    () => {
      if (step === 4) {
        const tl = gsap.timeline()
        tl.fromTo(
          '.confirm-icon-svg',
          { strokeDashoffset: 200 },
          { strokeDashoffset: 0, duration: 1.5, ease: 'power3.out' }
        )
          .fromTo(
            '.confirm-heading',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.8'
          )
          .fromTo(
            '.confirm-body',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.5'
          )
          .fromTo(
            '.confirm-timeline > div',
            { opacity: 0 },
            { opacity: 1, duration: 0.5, stagger: 0.3, ease: 'power2.out' },
            '-=0.3'
          )
          .fromTo(
            '.confirm-actions',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.2'
          )
      }
    },
    { scope: containerRef, dependencies: [step] }
  )

  /* -- Validate registration -- */
  const regValid = isValidUKRegistration(registration)

  /* -- Validate step 2 -- */
  const step2Valid = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!customer.fullName.trim()) newErrors.fullName = 'Required'
    if (!customer.email.trim()) newErrors.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
      newErrors.email = 'Invalid email'
    if (!customer.address1.trim()) newErrors.address1 = 'Required'
    if (!customer.city.trim()) newErrors.city = 'Required'
    if (!customer.postcode.trim()) newErrors.postcode = 'Required'
    if (plateType === 'road-legal' && uploadedFiles.length === 0)
      newErrors.documents = 'DVLA documents required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [customer, plateType, uploadedFiles])

  /* -- Validate step 3 -- */
  const step3Valid = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!termsAccepted) newErrors.terms = 'You must accept the terms'
    if (plateType === 'road-legal' && !roadLegalConfirmed)
      newErrors.roadLegal = 'You must confirm DVLA compliance'
    if (paymentMethod === 'card') {
      const cleanNum = cardDetails.number.replace(/\s/g, '')
      if (cleanNum.length < 16) newErrors.cardNumber = 'Invalid card number'
      if (!cardDetails.expiryMonth) newErrors.expiryMonth = 'Required'
      if (!cardDetails.expiryYear) newErrors.expiryYear = 'Required'
      if (!cardDetails.cvc || cardDetails.cvc.length < 3)
        newErrors.cvc = 'Invalid CVC'
      if (!cardDetails.name.trim()) newErrors.cardName = 'Required'
    }
    if (!billingSameAsShipping) {
      if (!billingAddress.fullName.trim())
        newErrors.billingFullName = 'Required'
      if (!billingAddress.address1.trim())
        newErrors.billingAddress1 = 'Required'
      if (!billingAddress.city.trim()) newErrors.billingCity = 'Required'
      if (!billingAddress.postcode.trim())
        newErrors.billingPostcode = 'Required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [
    termsAccepted,
    plateType,
    roadLegalConfirmed,
    paymentMethod,
    cardDetails,
    billingSameAsShipping,
    billingAddress,
  ])

  /* -- Submit order -- */
  const handlePlaceOrder = () => {
    if (!step3Valid()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setOrderNumber(
        `APX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`
      )
      setStep(4)
    }, 2000)
  }

  /* -- Handle file upload -- */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files).map((f) => f.name))
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy.documents
        return copy
      })
    }
  }

  /* -- Computed prices -- */
  const platePrice = getConfigPrice(plateConfig)
  const deliveryPrice = deliveryMethod === 'express' ? 6.99 : 0
  const totalPrice = platePrice + deliveryPrice

  /* -- Progress bar width -- */
  const progressWidth = step === 1 ? 0 : step === 2 ? 50 : step === 3 ? 100 : 100

  /* ==================== RENDER ==================== */
  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: C.bgVoid,
        minHeight: '100dvh',
        paddingTop: '104px',
        paddingBottom: '120px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        {/* ==================== PROGRESS BAR ==================== */}
        {step < 4 && (
          <div style={{ marginBottom: '48px' }}>
            {/* Step indicators */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '12px',
                position: 'relative',
              }}
            >
              {(['CONFIGURE', 'DETAILS', 'PAYMENT'] as const).map(
                (label, idx) => {
                  const stepNum = (idx + 1) as Step
                  const isActive = step === stepNum
                  const isCompleted = step > stepNum
                  return (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flex: 1,
                        justifyContent:
                          idx === 0
                            ? 'flex-start'
                            : idx === 2
                              ? 'flex-end'
                              : 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: isActive
                            ? C.accentGold
                            : isCompleted
                              ? C.accentGold
                              : C.borderSubtle,
                          opacity: isCompleted ? 0.5 : 1,
                          transform: isActive ? 'scale(1.2)' : 'scale(1)',
                          transition: 'all 0.3s ease',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.7rem',
                          letterSpacing: '0.1em',
                          color: isActive ? C.accentGold : C.textMuted,
                          textTransform: 'uppercase',
                        }}
                      >
                        {stepNum}. {label}
                      </span>
                    </div>
                  )
                }
              )}
            </div>
            {/* Bar */}
            <div
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: C.borderSubtle,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: C.accentGold,
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  width: `${progressWidth}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* ==================== MAIN LAYOUT ==================== */}
        {step < 4 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60% 40%',
              gap: '48px',
            }}
            className="checkout-main-grid"
          >
            {/* LEFT COLUMN */}
            <div className="checkout-step-content">
              {/* ========================================= */}
              {/* STEP 1: CONFIGURE                        */}
              {/* ========================================= */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <Step1Configure
                    registration={registration}
                    setRegistration={setRegistration}
                    plateConfig={plateConfig}
                    setPlateConfig={setPlateConfig}
                    plateType={plateType}
                    setPlateType={setPlateType}
                    notes={notes}
                    setNotes={setNotes}
                    regValid={regValid}
                    onContinue={() => setStep(2)}
                  />
                </div>
              )}

              {/* ========================================= */}
              {/* STEP 2: DETAILS                          */}
              {/* ========================================= */}
              {step === 2 && (
                <Step2Details
                  customer={customer}
                  setCustomer={setCustomer}
                  deliveryMethod={deliveryMethod}
                  setDeliveryMethod={setDeliveryMethod}
                  plateType={plateType}
                  uploadedFiles={uploadedFiles}
                  onFileUpload={handleFileUpload}
                  fileInputRef={fileInputRef}
                  errors={errors}
                  setErrors={setErrors}
                  onBack={() => setStep(1)}
                  onContinue={() => {
                    if (step2Valid()) setStep(3)
                  }}
                />
              )}

              {/* ========================================= */}
              {/* STEP 3: PAYMENT                          */}
              {/* ========================================= */}
              {step === 3 && (
                <Step3Payment
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  cardDetails={cardDetails}
                  setCardDetails={setCardDetails}
                  billingSameAsShipping={billingSameAsShipping}
                  setBillingSameAsShipping={setBillingSameAsShipping}
                  billingAddress={billingAddress}
                  setBillingAddress={setBillingAddress}
                  termsAccepted={termsAccepted}
                  setTermsAccepted={setTermsAccepted}
                  roadLegalConfirmed={roadLegalConfirmed}
                  setRoadLegalConfirmed={setRoadLegalConfirmed}
                  plateType={plateType}
                  errors={errors}
                  setErrors={setErrors}
                  totalPrice={totalPrice}
                  isSubmitting={isSubmitting}
                  onBack={() => setStep(2)}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </div>

            {/* RIGHT COLUMN — ORDER SUMMARY */}
            <div
              style={{
                position: 'sticky',
                top: '104px',
                alignSelf: 'start',
                height: 'fit-content',
              }}
              className="checkout-summary-col"
            >
              <OrderSummary
                registration={registration}
                plateConfig={plateConfig}
                plateType={plateType}
                platePrice={platePrice}
                deliveryMethod={deliveryMethod}
                deliveryPrice={deliveryPrice}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        ) : (
          /* ========================================= */
          /* STEP 4: ORDER CONFIRMATION               */
          /* ========================================= */
          <Step4Confirmation
            orderNumber={orderNumber}
            customerEmail={customer.email}
            onContinueShopping={() => navigate('/')}
          />
        )}
      </div>

      {/* Responsive CSS */}
      <style>{`
        .checkout-main-grid {
          grid-template-columns: 60% 40%;
        }
        @media (max-width: 1024px) {
          .checkout-main-grid {
            grid-template-columns: 1fr;
          }
          .checkout-summary-col {
            position: relative !important;
            top: 0 !important;
            order: -1;
          }
        }
        @media (max-width: 768px) {
          .checkout-main-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        .spin-loader {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/* ================================================================== */
/*  STEP 1: CONFIGURE                                                */
/* ================================================================== */
function Step1Configure({
  registration,
  setRegistration,
  plateConfig,
  setPlateConfig,
  plateType,
  setPlateType,
  notes,
  setNotes,
  regValid,
  onContinue,
}: {
  registration: string
  setRegistration: (v: string) => void
  plateConfig: PlateConfig
  setPlateConfig: (v: PlateConfig) => void
  plateType: PlateType
  setPlateType: (v: PlateType) => void
  notes: string
  setNotes: (v: string) => void
  regValid: boolean
  onContinue: () => void
}) {
  return (
    <>
      {/* Plate Preview */}
      <div>
        <label
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: C.accentGold,
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          LIVE PREVIEW
        </label>
        <PlatePreview registration={registration} />
      </div>

      {/* Registration Input */}
      <div>
        <SectionLabel>YOUR REGISTRATION</SectionLabel>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={registration}
            onChange={(e) =>
              setRegistration(e.target.value.toUpperCase())
            }
            placeholder="AB12 CDE"
            style={{
              width: '100%',
              padding: '16px',
              paddingRight: '48px',
              backgroundColor: C.bgSurface,
              border: `1px solid ${regValid ? C.successGreen : C.borderSubtle}`,
              borderRadius: '8px',
              color: C.textPrimary,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '1.25rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              outline: 'none',
              transition: 'border-color 0.3s ease',
            }}
          />
          {regValid && (
            <div
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <Check size={20} color={C.successGreen} strokeWidth={2.5} />
            </div>
          )}
        </div>
        <p
          style={{
            fontSize: '0.875rem',
            color: C.textMuted,
            marginTop: '8px',
            lineHeight: 1.5,
          }}
        >
          Enter your registration exactly as it appears on your V5C document.
        </p>
      </div>

      {/* Plate Configuration */}
      <div>
        <SectionLabel>PLATE CONFIGURATION</SectionLabel>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {(
            [
              { value: 'front-rear', label: 'FRONT & REAR', price: '£59.99' },
              { value: 'front-only', label: 'FRONT ONLY', price: '£34.99' },
              { value: 'rear-only', label: 'REAR ONLY', price: '£34.99' },
            ] as { value: PlateConfig; label: string; price: string }[]
          ).map((opt) => (
            <RadioCard
              key={opt.value}
              selected={plateConfig === opt.value}
              onClick={() => setPlateConfig(opt.value)}
            >
              <span style={{ fontWeight: 500 }}>{opt.label}</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: C.accentGold,
                  fontSize: '0.9rem',
                }}
              >
                — {opt.price}
              </span>
            </RadioCard>
          ))}
        </div>
      </div>

      {/* Plate Type Toggle */}
      <div>
        <SectionLabel>PLATE TYPE</SectionLabel>
        <div
          style={{
            display: 'flex',
            borderRadius: '8px',
            overflow: 'hidden',
            border: `1px solid ${C.borderSubtle}`,
          }}
        >
          {(['road-legal', 'show-plate'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPlateType(type)}
              style={{
                flex: 1,
                padding: '14px 16px',
                backgroundColor:
                  plateType === type ? C.accentGold : C.bgSurface,
                color:
                  plateType === type ? C.bgVoid : C.textMuted,
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: plateType === type ? 600 : 400,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.2s ease',
              }}
            >
              {type === 'road-legal' ? 'ROAD LEGAL' : 'SHOW PLATE'}
            </button>
          ))}
        </div>
        {plateType === 'show-plate' && (
          <p
            style={{
              fontSize: '0.8rem',
              color: C.alertRed,
              marginTop: '8px',
            }}
          >
            Show plates are not road legal. For off-road/show use only.
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <SectionLabel>ADDITIONAL NOTES</SectionLabel>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requirements or requests..."
          rows={4}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: C.bgSurface,
            border: `1px solid ${C.borderSubtle}`,
            borderRadius: '8px',
            color: C.textPrimary,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '1rem',
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical',
            transition: 'border-color 0.3s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = C.accentGold
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = C.borderSubtle
          }}
        />
      </div>

      {/* Continue Button */}
      <PrimaryButton
        onClick={onContinue}
        disabled={!regValid}
        fullWidth
      >
        CONTINUE TO DETAILS
        <ChevronRight size={18} />
      </PrimaryButton>
    </>
  )
}

/* ================================================================== */
/*  STEP 2: DETAILS                                                  */
/* ================================================================== */
function Step2Details({
  customer,
  setCustomer,
  deliveryMethod,
  setDeliveryMethod,
  plateType,
  uploadedFiles,
  onFileUpload,
  fileInputRef,
  errors,
  setErrors,
  onBack,
  onContinue,
}: {
  customer: CustomerDetails
  setCustomer: React.Dispatch<React.SetStateAction<CustomerDetails>>
  deliveryMethod: DeliveryMethod
  setDeliveryMethod: (v: DeliveryMethod) => void
  plateType: PlateType
  uploadedFiles: string[]
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  errors: Record<string, string>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  onBack: () => void
  onContinue: () => void
}) {
  const updateField = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    backgroundColor: C.bgSurface,
    border: `1px solid ${errors[field] ? C.alertRed : C.borderSubtle}`,
    borderRadius: '8px',
    color: C.textPrimary,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  })

  return (
    <>
      <div>
        <SectionLabel>EMAIL ADDRESS</SectionLabel>
        <input
          type="email"
          value={customer.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="you@example.com"
          style={inputStyle('email')}
          onFocus={(e) => {
            e.currentTarget.style.borderColor =
              errors.email ? C.alertRed : C.accentGold
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor =
              errors.email ? C.alertRed : C.borderSubtle
          }}
        />
        {errors.email && (
          <ErrorMessage>{errors.email}</ErrorMessage>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
        className="form-grid-2"
      >
        <div>
          <SectionLabel>FULL NAME</SectionLabel>
          <input
            type="text"
            value={customer.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="John Smith"
            style={inputStyle('fullName')}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = C.accentGold
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.fullName
                ? C.alertRed
                : C.borderSubtle
            }}
          />
          {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
        </div>
        <div>
          <SectionLabel>
            PHONE NUMBER{' '}
            <span style={{ color: C.textMuted }}>(OPTIONAL)</span>
          </SectionLabel>
          <input
            type="tel"
            value={customer.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+44 7123 456789"
            style={inputStyle('phone')}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = C.accentGold
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = C.borderSubtle
            }}
          />
        </div>
      </div>

      <div>
        <SectionLabel>ADDRESS LINE 1</SectionLabel>
        <input
          type="text"
          value={customer.address1}
          onChange={(e) => updateField('address1', e.target.value)}
          placeholder="123 Main Street"
          style={inputStyle('address1')}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = C.accentGold
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = errors.address1
              ? C.alertRed
              : C.borderSubtle
          }}
        />
        {errors.address1 && <ErrorMessage>{errors.address1}</ErrorMessage>}
      </div>

      <div>
        <SectionLabel>
          ADDRESS LINE 2{' '}
          <span style={{ color: C.textMuted }}>(OPTIONAL)</span>
        </SectionLabel>
        <input
          type="text"
          value={customer.address2}
          onChange={(e) => updateField('address2', e.target.value)}
          placeholder="Apt 4B"
          style={inputStyle('address2')}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = C.accentGold
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = C.borderSubtle
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '16px',
        }}
        className="form-grid-3"
      >
        <div>
          <SectionLabel>CITY</SectionLabel>
          <input
            type="text"
            value={customer.city}
            onChange={(e) => updateField('city', e.target.value)}
            placeholder="London"
            style={inputStyle('city')}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = C.accentGold
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.city
                ? C.alertRed
                : C.borderSubtle
            }}
          />
          {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
        </div>
        <div>
          <SectionLabel>POSTCODE</SectionLabel>
          <input
            type="text"
            value={customer.postcode}
            onChange={(e) =>
              updateField('postcode', e.target.value.toUpperCase())
            }
            placeholder="SW1A 1AA"
            style={{
              ...inputStyle('postcode'),
              textTransform: 'uppercase',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = C.accentGold
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.postcode
                ? C.alertRed
                : C.borderSubtle
            }}
          />
          {errors.postcode && (
            <ErrorMessage>{errors.postcode}</ErrorMessage>
          )}
        </div>
        <div>
          <SectionLabel>COUNTRY</SectionLabel>
          <select
            value={customer.country}
            onChange={(e) => updateField('country', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: C.bgSurface,
              border: `1px solid ${C.borderSubtle}`,
              borderRadius: '8px',
              color: C.textPrimary,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '1rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="United Kingdom">United Kingdom</option>
            <option value="Ireland">Ireland</option>
          </select>
        </div>
      </div>

      {/* Delivery Method */}
      <div>
        <SectionLabel>DELIVERY METHOD</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <RadioCard
            selected={deliveryMethod === 'standard'}
            onClick={() => setDeliveryMethod('standard')}
          >
            <span style={{ fontWeight: 500 }}>STANDARD DELIVERY</span>
            <span style={{ color: C.successGreen, fontWeight: 500 }}>
              FREE
            </span>
            <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>
              3-5 working days
            </span>
          </RadioCard>
          <RadioCard
            selected={deliveryMethod === 'express'}
            onClick={() => setDeliveryMethod('express')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color={C.accentGold} />
              <span style={{ fontWeight: 500 }}>EXPRESS DELIVERY</span>
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: C.accentGold,
                fontSize: '0.9rem',
              }}
            >
              £6.99
            </span>
            <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>
              Next working day
            </span>
          </RadioCard>
        </div>
      </div>

      {/* DVLA Document Upload */}
      {plateType === 'road-legal' && (
        <div>
          <SectionLabel>DVLA DOCUMENTS</SectionLabel>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              if (e.dataTransfer.files.length > 0) {
                const dt = new DataTransfer()
                Array.from(e.dataTransfer.files).forEach((f) => dt.items.add(f))
                const syntheticEvent = {
                  currentTarget: {
                    files: dt.files,
                  },
                } as React.ChangeEvent<HTMLInputElement>
                onFileUpload(syntheticEvent)
              }
            }}
            style={{
              border: `2px dashed ${errors.documents ? C.alertRed : C.borderSubtle}`,
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: uploadedFiles.length > 0
                ? 'rgba(79, 138, 79, 0.05)'
                : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (uploadedFiles.length === 0) {
                e.currentTarget.style.borderColor = C.accentGold
                e.currentTarget.style.backgroundColor =
                  'rgba(255, 215, 0, 0.05)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = errors.documents
                ? C.alertRed
                : C.borderSubtle
              e.currentTarget.style.backgroundColor =
                uploadedFiles.length > 0
                  ? 'rgba(79, 138, 79, 0.05)'
                  : 'transparent'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onFileUpload}
              style={{ display: 'none' }}
            />
            {uploadedFiles.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: C.successGreen,
                }}
              >
                <Check size={20} strokeWidth={2.5} />
                <span style={{ fontWeight: 500 }}>
                  {uploadedFiles.join(', ')}
                </span>
              </div>
            ) : (
              <>
                <Upload
                  size={32}
                  color={C.textMuted}
                  style={{ marginBottom: '12px' }}
                />
                <p style={{ color: C.textMuted, fontSize: '1rem' }}>
                  Drag &amp; drop or click to upload
                </p>
                <p
                  style={{
                    color: C.textMuted,
                    fontSize: '0.75rem',
                    marginTop: '8px',
                  }}
                >
                  V5C, V5C/2, or V948 — PDF, JPG, PNG up to 5MB
                </p>
              </>
            )}
          </div>
          {errors.documents && (
            <ErrorMessage>{errors.documents}</ErrorMessage>
          )}
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        <SecondaryButton onClick={onBack} style={{ flex: 1 }}>
          BACK
        </SecondaryButton>
        <PrimaryButton onClick={onContinue} style={{ flex: 1 }}>
          CONTINUE TO PAYMENT
        </PrimaryButton>
      </div>

      <style>{`
        .form-grid-2 {
          grid-template-columns: 1fr 1fr;
        }
        .form-grid-3 {
          grid-template-columns: 2fr 1fr 1fr;
        }
        @media (max-width: 768px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}

/* ================================================================== */
/*  STEP 3: PAYMENT                                                  */
/* ================================================================== */
function Step3Payment({
  paymentMethod,
  setPaymentMethod,
  cardDetails,
  setCardDetails,
  billingSameAsShipping,
  setBillingSameAsShipping,
  billingAddress,
  setBillingAddress,
  termsAccepted,
  setTermsAccepted,
  roadLegalConfirmed,
  setRoadLegalConfirmed,
  plateType,
  errors,
  setErrors,
  totalPrice,
  isSubmitting,
  onBack,
  onPlaceOrder,
}: {
  paymentMethod: PaymentMethod
  setPaymentMethod: (v: PaymentMethod) => void
  cardDetails: CardDetails
  setCardDetails: React.Dispatch<React.SetStateAction<CardDetails>>
  billingSameAsShipping: boolean
  setBillingSameAsShipping: (v: boolean) => void
  billingAddress: CustomerDetails
  setBillingAddress: React.Dispatch<React.SetStateAction<CustomerDetails>>
  termsAccepted: boolean
  setTermsAccepted: (v: boolean) => void
  roadLegalConfirmed: boolean
  setRoadLegalConfirmed: (v: boolean) => void
  plateType: PlateType
  errors: Record<string, string>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  totalPrice: number
  isSubmitting: boolean
  onBack: () => void
  onPlaceOrder: () => void
}) {
  const updateCard = (field: keyof CardDetails, value: string) => {
    if (field === 'number') value = formatCardNumber(value)
    if (field === 'expiryMonth') value = value.replace(/\D/g, '').slice(0, 2)
    if (field === 'expiryYear') value = value.replace(/\D/g, '').slice(0, 2)
    if (field === 'cvc') value = value.replace(/\D/g, '').slice(0, 4)
    setCardDetails((prev) => ({ ...prev, [field]: value }))
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    backgroundColor: C.bgSurface,
    border: `1px solid ${errors[field] ? C.alertRed : C.borderSubtle}`,
    borderRadius: '8px',
    color: C.textPrimary,
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  })

  return (
    <>
      {/* Payment Method Selection */}
      <div>
        <SectionLabel>PAYMENT METHOD</SectionLabel>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {(
            [
              {
                value: 'card' as const,
                label: 'CREDIT / DEBIT CARD',
                icon: <CreditCard size={20} color={C.accentGold} />,
              },
              {
                value: 'paypal' as const,
                label: 'PAYPAL',
                icon: (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0070BA',
                    }}
                  >
                    PP
                  </span>
                ),
              },
              {
                value: 'clearpay' as const,
                label: 'CLEARPAY',
                icon: (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: C.textPrimary,
                    }}
                  >
                    CP
                  </span>
                ),
              },
            ] as const
          ).map((opt) => (
            <RadioCard
              key={opt.value}
              selected={paymentMethod === opt.value}
              onClick={() => setPaymentMethod(opt.value)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {opt.icon}
                <span style={{ fontWeight: 500 }}>{opt.label}</span>
              </div>
            </RadioCard>
          ))}
        </div>
      </div>

      {/* Card Details */}
      {paymentMethod === 'card' && (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <SectionLabel>CARD NUMBER</SectionLabel>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => updateCard('number', e.target.value)}
              placeholder="0000 0000 0000 0000"
              style={{
                ...inputStyle('cardNumber'),
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.1em',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.accentGold
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.cardNumber
                  ? C.alertRed
                  : C.borderSubtle
              }}
            />
            {errors.cardNumber && (
              <ErrorMessage>{errors.cardNumber}</ErrorMessage>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
            }}
            className="card-grid"
          >
            <div>
              <SectionLabel>MM</SectionLabel>
              <input
                type="text"
                value={cardDetails.expiryMonth}
                onChange={(e) =>
                  updateCard('expiryMonth', e.target.value)
                }
                placeholder="MM"
                style={{
                  ...inputStyle('expiryMonth'),
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: 'center',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.accentGold
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.expiryMonth
                    ? C.alertRed
                    : C.borderSubtle
                }}
              />
            </div>
            <div>
              <SectionLabel>YY</SectionLabel>
              <input
                type="text"
                value={cardDetails.expiryYear}
                onChange={(e) =>
                  updateCard('expiryYear', e.target.value)
                }
                placeholder="YY"
                style={{
                  ...inputStyle('expiryYear'),
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: 'center',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.accentGold
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.expiryYear
                    ? C.alertRed
                    : C.borderSubtle
                }}
              />
            </div>
            <div>
              <SectionLabel>CVC</SectionLabel>
              <input
                type="text"
                value={cardDetails.cvc}
                onChange={(e) => updateCard('cvc', e.target.value)}
                placeholder="123"
                style={{
                  ...inputStyle('cvc'),
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: 'center',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.accentGold
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.cvc
                    ? C.alertRed
                    : C.borderSubtle
                }}
              />
              {errors.cvc && <ErrorMessage>{errors.cvc}</ErrorMessage>}
            </div>
          </div>

          <div>
            <SectionLabel>NAME ON CARD</SectionLabel>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => updateCard('name', e.target.value)}
              placeholder="JOHN SMITH"
              style={{
                ...inputStyle('cardName'),
                textTransform: 'uppercase',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.accentGold
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.cardName
                  ? C.alertRed
                  : C.borderSubtle
              }}
            />
            {errors.cardName && (
              <ErrorMessage>{errors.cardName}</ErrorMessage>
            )}
          </div>

          <style>{`
            .card-grid {
              grid-template-columns: 1fr 1fr 1fr;
            }
            @media (max-width: 768px) {
              .card-grid {
                grid-template-columns: 1fr 1fr 1fr;
              }
            }
          `}</style>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div
          style={{
            padding: '24px',
            backgroundColor: C.bgSurface,
            borderRadius: '8px',
            border: `1px solid ${C.borderSubtle}`,
          }}
        >
          <p style={{ color: C.textMuted, fontSize: '1rem' }}>
            You will be redirected to PayPal to complete your purchase.
          </p>
        </div>
      )}

      {paymentMethod === 'clearpay' && (
        <div
          style={{
            padding: '24px',
            backgroundColor: C.bgSurface,
            borderRadius: '8px',
            border: `1px solid ${C.borderSubtle}`,
          }}
        >
          <p style={{ color: C.textMuted, fontSize: '1rem' }}>
            Pay in 4 interest-free instalments with Clearpay. You will be
            redirected to complete your purchase.
          </p>
        </div>
      )}

      {/* Billing Address */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          backgroundColor: C.bgSurface,
          borderRadius: '8px',
          border: `1px solid ${C.borderSubtle}`,
          cursor: 'pointer',
        }}
        onClick={() => setBillingSameAsShipping(!billingSameAsShipping)}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            border: `2px solid ${billingSameAsShipping ? C.accentGold : C.borderSubtle}`,
            backgroundColor: billingSameAsShipping
              ? C.accentGold
              : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          {billingSameAsShipping && (
            <Check size={14} color={C.bgVoid} strokeWidth={3} />
          )}
        </div>
        <span
          style={{
            fontSize: '0.95rem',
            color: C.textMuted,
            userSelect: 'none',
          }}
        >
          Same as shipping address
        </span>
      </div>

      {!billingSameAsShipping && (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          <div>
            <SectionLabel>BILLING FULL NAME</SectionLabel>
            <input
              type="text"
              value={billingAddress.fullName}
              onChange={(e) =>
                setBillingAddress((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              placeholder="John Smith"
              style={inputStyle('billingFullName')}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.accentGold
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.billingFullName
                  ? C.alertRed
                  : C.borderSubtle
              }}
            />
          </div>
          <div>
            <SectionLabel>BILLING ADDRESS</SectionLabel>
            <input
              type="text"
              value={billingAddress.address1}
              onChange={(e) =>
                setBillingAddress((prev) => ({
                  ...prev,
                  address1: e.target.value,
                }))
              }
              placeholder="123 Main Street"
              style={inputStyle('billingAddress1')}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.accentGold
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.billingAddress1
                  ? C.alertRed
                  : C.borderSubtle
              }}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div>
              <SectionLabel>BILLING CITY</SectionLabel>
              <input
                type="text"
                value={billingAddress.city}
                onChange={(e) =>
                  setBillingAddress((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                placeholder="London"
                style={inputStyle('billingCity')}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.accentGold
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.billingCity
                    ? C.alertRed
                    : C.borderSubtle
                }}
              />
            </div>
            <div>
              <SectionLabel>BILLING POSTCODE</SectionLabel>
              <input
                type="text"
                value={billingAddress.postcode}
                onChange={(e) =>
                  setBillingAddress((prev) => ({
                    ...prev,
                    postcode: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="SW1A 1AA"
                style={{
                  ...inputStyle('billingPostcode'),
                  textTransform: 'uppercase',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.accentGold
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.billingPostcode
                    ? C.alertRed
                    : C.borderSubtle
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Terms */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={() => {
            setTermsAccepted(!termsAccepted)
            if (errors.terms) {
              setErrors((prev) => {
                const copy = { ...prev }
                delete copy.terms
                return copy
              })
            }
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              border: `2px solid ${termsAccepted ? C.accentGold : errors.terms ? C.alertRed : C.borderSubtle}`,
              backgroundColor: termsAccepted ? C.accentGold : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              marginTop: '2px',
            }}
          >
            {termsAccepted && (
              <Check size={14} color={C.bgVoid} strokeWidth={3} />
            )}
          </div>
          <span style={{ fontSize: '0.9rem', color: C.textMuted }}>
            I agree to the{' '}
            <span
              style={{
                color: C.accentGold,
                textDecoration: 'underline',
              }}
            >
              Terms of Service
            </span>{' '}
            and{' '}
            <span
              style={{
                color: C.accentGold,
                textDecoration: 'underline',
              }}
            >
              Privacy Policy
            </span>
          </span>
        </div>
        {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}

        {plateType === 'road-legal' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setRoadLegalConfirmed(!roadLegalConfirmed)
              if (errors.roadLegal) {
                setErrors((prev) => {
                  const copy = { ...prev }
                  delete copy.roadLegal
                  return copy
                })
              }
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: `2px solid ${roadLegalConfirmed ? C.accentGold : errors.roadLegal ? C.alertRed : C.borderSubtle}`,
                backgroundColor: roadLegalConfirmed
                  ? C.accentGold
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              {roadLegalConfirmed && (
                <Check size={14} color={C.bgVoid} strokeWidth={3} />
              )}
            </div>
            <span style={{ fontSize: '0.9rem', color: C.textMuted }}>
              I confirm this is a DVLA-compliant road legal plate order.
            </span>
          </div>
        )}
        {errors.roadLegal && (
          <ErrorMessage>{errors.roadLegal}</ErrorMessage>
        )}
      </div>

      {/* Pay Button */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '8px',
        }}
      >
        <SecondaryButton onClick={onBack} style={{ flex: 1 }}>
          BACK
        </SecondaryButton>
        <button
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: '16px 32px',
            borderRadius: '9999px',
            backgroundColor: isSubmitting ? C.successGreen : C.accentGold,
            color: C.bgVoid,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.72px',
            textTransform: 'uppercase',
            border: 'none',
            cursor: isSubmitting ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow =
                '0 0 40px rgba(255, 215, 0, 0.2)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader size={20} className="spin-loader" />
              PROCESSING...
            </>
          ) : (
            <>PAY £{totalPrice.toFixed(2)}</>
          )}
        </button>
      </div>
    </>
  )
}

/* ================================================================== */
/*  STEP 4: ORDER CONFIRMATION                                       */
/* ================================================================== */
function Step4Confirmation({
  orderNumber,
  customerEmail,
  onContinueShopping,
}: {
  orderNumber: string
  customerEmail: string
  onContinueShopping: () => void
}) {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '120px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* Success Icon */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: `2px solid ${C.successGreen}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          className="confirm-icon-svg"
        >
          <path
            d="M10 20L17 27L30 13"
            stroke={C.successGreen}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: 0,
            }}
          />
        </svg>
      </div>

      {/* Heading */}
      <h1
        className="confirm-heading"
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          letterSpacing: '-2.4px',
          color: C.textPrimary,
          textTransform: 'uppercase',
          lineHeight: 0.9,
          marginBottom: '16px',
        }}
      >
        ORDER CONFIRMED
      </h1>

      {/* Order Number */}
      <p
        className="confirm-body"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.2rem',
          color: C.accentGold,
          letterSpacing: '0.05em',
          marginBottom: '24px',
        }}
      >
        {orderNumber}
      </p>

      {/* Body */}
      <p
        className="confirm-body"
        style={{
          fontSize: '1rem',
          color: C.textMuted,
          lineHeight: 1.6,
          maxWidth: '480px',
          marginBottom: '40px',
        }}
      >
        Thank you for your order. We've sent a confirmation email to{' '}
        <span style={{ color: C.textPrimary }}>{customerEmail || 'you'}</span>.
        Your plates will be handcrafted and dispatched within 24 hours.
      </p>

      {/* Delivery Timeline */}
      <div
        className="confirm-timeline"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '48px',
        }}
      >
        {[
          { label: 'ORDERED', active: true },
          { label: 'PRODUCTION', active: false },
          { label: 'DISPATCHED', active: false },
        ].map((item, idx) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: item.active ? C.successGreen : C.textMuted,
                textTransform: 'uppercase',
              }}
            >
              {item.active && '✓ '}
              {item.label}
            </span>
            {idx < 2 && (
              <span
                style={{
                  color: C.borderSubtle,
                  fontSize: '0.75rem',
                }}
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* CTA Row */}
      <div
        className="confirm-actions"
        style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '48px',
        }}
      >
        <SecondaryButton
          onClick={() => {}}
          style={{ minWidth: '160px' }}
        >
          TRACK ORDER
        </SecondaryButton>
        <PrimaryButton
          onClick={onContinueShopping}
          style={{ minWidth: '200px' }}
        >
          CONTINUE SHOPPING
        </PrimaryButton>
      </div>

      {/* Social Share */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontSize: '0.875rem',
            color: C.textMuted,
          }}
        >
          Share your build:
        </span>
        <SocialIcon icon={<Instagram size={18} />} />
        <SocialIcon
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          }
        />
        <SocialIcon icon={<Facebook size={18} />} />
      </div>
    </div>
  )
}

/* ================================================================== */
/*  PLATE PREVIEW COMPONENT                                            */
/* ================================================================== */
function PlatePreview({ registration }: { registration: string }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '520px',
        height: '120px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Subtle border */}
      <div
        style={{
          position: 'absolute',
          inset: '4px',
          border: '2px solid rgba(0,0,0,0.08)',
          borderRadius: '6px',
        }}
      />
      {/* Registration text */}
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '3rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#111111',
          textTransform: 'uppercase',
          zIndex: 1,
        }}
      >
        {registration || 'AB12 CDE'}
      </span>
    </div>
  )
}

/* ================================================================== */
/*  ORDER SUMMARY SIDEBAR                                              */
/* ================================================================== */
function OrderSummary({
  registration,
  plateConfig,
  plateType,
  platePrice,
  deliveryMethod,
  deliveryPrice,
  totalPrice,
}: {
  registration: string
  plateConfig: PlateConfig
  plateType: PlateType
  platePrice: number
  deliveryMethod: DeliveryMethod
  deliveryPrice: number
  totalPrice: number
}) {
  const configLabel =
    plateConfig === 'front-rear'
      ? 'FRONT & REAR'
      : plateConfig === 'front-only'
        ? 'FRONT ONLY'
        : 'REAR ONLY'

  return (
    <div
      style={{
        backgroundColor: 'rgba(17, 17, 17, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        padding: '24px',
      }}
    >
      {/* Header */}
      <h3
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: '1.125rem',
          letterSpacing: '0.15em',
          color: C.textPrimary,
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}
      >
        ORDER SUMMARY
      </h3>

      {/* Product Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <img
          src="/plate-4d-gel-black-01.jpg"
          alt="4D 5mm Gel Black"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '4px',
            objectFit: 'cover',
          }}
        />
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontWeight: 500,
              color: C.textPrimary,
              fontSize: '0.95rem',
            }}
          >
            4D 5MM GEL BLACK
          </p>
          <p
            style={{
              color: C.textMuted,
              fontSize: '0.85rem',
            }}
          >
            × 1
          </p>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: C.textPrimary,
            fontSize: '0.95rem',
          }}
        >
          £{platePrice.toFixed(2)}
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: C.borderSubtle,
          margin: '16px 0',
        }}
      />

      {/* Configuration Summary */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <SummaryLine>
          <span>REGISTRATION:</span>
          <span>
            {registration || '—'}
          </span>
        </SummaryLine>
        <SummaryLine>
          <span>CONFIG:</span>
          <span>{configLabel}</span>
        </SummaryLine>
        <SummaryLine>
          <span>TYPE:</span>
          <span
            style={{
              color:
                plateType === 'road-legal'
                  ? C.successGreen
                  : C.alertRed,
            }}
          >
            {plateType === 'road-legal' ? 'ROAD LEGAL' : 'SHOW PLATE'}
          </span>
        </SummaryLine>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: C.borderSubtle,
          margin: '16px 0',
        }}
      />

      {/* Subtotal */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ color: C.textMuted, fontSize: '0.95rem' }}>
          SUBTOTAL
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: C.textMuted,
            fontSize: '0.95rem',
          }}
        >
          £{platePrice.toFixed(2)}
        </span>
      </div>

      {/* Shipping */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ color: C.textMuted, fontSize: '0.95rem' }}>
          SHIPPING ({deliveryMethod.toUpperCase()})
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: deliveryPrice === 0 ? C.successGreen : C.accentGold,
            fontSize: '0.95rem',
          }}
        >
          {deliveryPrice === 0 ? 'FREE' : `£${deliveryPrice.toFixed(2)}`}
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: C.borderSubtle,
          margin: '16px 0',
        }}
      />

      {/* Total */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: '1.25rem',
            color: C.textPrimary,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
          }}
        >
          TOTAL
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            fontSize: '1.25rem',
            color: C.accentGold,
          }}
        >
          £{totalPrice.toFixed(2)}
        </span>
      </div>

      {/* Trust Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '16px',
          justifyContent: 'center',
        }}
      >
        {[
          { icon: <Lock size={12} />, text: 'SSL SECURE' },
          { icon: <Award size={12} />, text: 'DVLA APPROVED' },
          { icon: <Clock size={12} />, text: '24H DISPATCH' },
        ].map((trust) => (
          <span
            key={trust.text}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: C.textMuted,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {trust.icon}
            {trust.text}
          </span>
        ))}
      </div>

      {/* Payment Icons */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginTop: '12px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PaymentMethodIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="3" fill="#757575" opacity="0.15" />
            <text x="3" y="16" fill="#757575" fontSize="8" fontWeight="700" fontStyle="italic">VISA</text>
          </svg>
        </PaymentMethodIcon>
        <PaymentMethodIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#757575" opacity="0.2" />
            <text x="6" y="16" fill="#757575" fontSize="7" fontWeight="700">MC</text>
          </svg>
        </PaymentMethodIcon>
        <PaymentMethodIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#757575" opacity="0.2" />
            <text x="4" y="16" fill="#757575" fontSize="8" fontWeight="700">PP</text>
          </svg>
        </PaymentMethodIcon>
        <PaymentMethodIcon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#757575" opacity="0.2" />
            <text x="4" y="16" fill="#757575" fontSize="8" fontWeight="700">CP</text>
          </svg>
        </PaymentMethodIcon>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  SHARED COMPONENTS                                                  */
/* ================================================================== */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: '0.875rem',
        letterSpacing: '0.15em',
        color: C.textPrimary,
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}
    >
      {children}
    </label>
  )
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: C.alertRed,
        fontSize: '0.8rem',
        marginTop: '4px',
      }}
    >
      {children}
    </p>
  )
}

function RadioCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        backgroundColor: selected ? 'rgba(255, 215, 0, 0.08)' : C.bgSurface,
        border: `1px solid ${selected ? C.accentGold : C.borderSubtle}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: C.textPrimary,
        gap: '12px',
        flexWrap: 'wrap',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = C.borderSubtle
        }
      }}
    >
      {children}
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          border: `2px solid ${selected ? C.accentGold : C.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'border-color 0.3s ease',
        }}
      >
        {selected && (
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: C.accentGold,
            }}
          />
        )}
      </div>
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  fullWidth,
  style: extraStyle,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  fullWidth?: boolean
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '16px 32px',
        borderRadius: '9999px',
        backgroundColor: disabled ? 'rgba(255, 215, 0, 0.3)' : C.accentGold,
        color: C.bgVoid,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: '0.95rem',
        letterSpacing: '-0.72px',
        textTransform: 'uppercase',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        transform: 'translateY(0)',
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow =
            '0 0 40px rgba(255, 215, 0, 0.2)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick,
  style: extraStyle,
}: {
  children: React.ReactNode
  onClick: () => void
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '16px 32px',
        borderRadius: '9999px',
        backgroundColor: 'transparent',
        color: C.textPrimary,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: '0.95rem',
        letterSpacing: '-0.72px',
        textTransform: 'uppercase',
        border: `1px solid ${C.textMuted}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.accentGold
        e.currentTarget.style.color = C.accentGold
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.textMuted
        e.currentTarget.style.color = C.textPrimary
      }}
    >
      {children}
    </button>
  )
}

function SummaryLine({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.8rem',
        color: C.textMuted,
        letterSpacing: '0.02em',
      }}
    >
      {children}
    </div>
  )
}

function PaymentMethodIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        opacity: 0.5,
      }}
    >
      {children}
    </div>
  )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: `1px solid ${C.borderSubtle}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: C.textMuted,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.accentGold
        e.currentTarget.style.color = C.accentGold
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.borderSubtle
        e.currentTarget.style.color = C.textMuted
      }}
    >
      {icon}
    </div>
  )
}
