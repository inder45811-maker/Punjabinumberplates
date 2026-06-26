import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ChevronRight,
  Loader2,
  Minus,
  Plus,
} from 'lucide-react'
import PlatePreview, { PlateHolderPreview } from '../components/PlatePreview'
import { productKindFor, readableStyleFromProductTitle } from '../lib/catalog'
import { addonsForKind } from '../lib/addons'
import {
  customLineAttributes,
  firstAvailableVariant,
  getProductByHandle,
  getProductsByHandles,
  imageUrl,
  money,
  productImage,
  variantById,
  variantByOptions,
  type Attribute,
  type CartLineInput,
  type StorefrontProduct,
  type StorefrontVariant,
} from '../lib/shopify'
import { productAlt, productSchema, useSeo } from '../lib/seo'
import { useCart } from '../context/CartContext'

type PlateType = 'Road Legal' | 'Show Plate'
type PlateSide = 'front' | 'rear'

function defaultPlateType(product: StorefrontProduct | null): PlateType {
  const title = product?.title.toLowerCase() ?? ''
  return title.includes('show') ? 'Show Plate' : 'Road Legal'
}

// Shopify products can carry their own front/rear option (e.g. "Amount of 2D
// printed plates"). When one exists it drives variant pricing, so the builder's
// hardcoded Configuration card would duplicate it.
function isConfigurationOption(option: { name: string; values: string[] }) {
  if (option.values.length < 2) return false
  return option.values.every((value) => /\b(front|rear|back)\b/i.test(value))
}

function selectedOptionsFromVariant(variant: StorefrontVariant | null) {
  return Object.fromEntries(variant?.selectedOptions.map((option) => [option.name, option.value]) ?? [])
}

export default function BuilderPage() {
  const { productHandle } = useParams()
  const [searchParams] = useSearchParams()
  const variantParam = searchParams.get('variant')
  const navigate = useNavigate()
  const { addToCart, closeCart, isLoading: cartLoading, error: cartError, clearError } = useCart()

  const [product, setProduct] = useState<StorefrontProduct | null>(null)
  const [variant, setVariant] = useState<StorefrontVariant | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [registration, setRegistration] = useState('')
  const [holderRegistration, setHolderRegistration] = useState('')
  const [holderText, setHolderText] = useState('')
  const [plateType, setPlateType] = useState<PlateType>('Road Legal')
  const [plateSide, setPlateSide] = useState<PlateSide>('rear')
  const [configuration, setConfiguration] = useState('Front and Rear')
  const [signText, setSignText] = useState('')
  const [writingColour, setWritingColour] = useState('')
  const [backgroundColour, setBackgroundColour] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [addonProducts, setAddonProducts] = useState<Map<string, StorefrontProduct>>(new Map())
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(Boolean(productHandle))
  const [isPreparingCheckout, setIsPreparingCheckout] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const checkoutRequestRef = useRef(false)

  const image = product ? productImage(product, variant) : null
  const styleLabel = product ? readableStyleFromProductTitle(product.title) || product.title : 'Custom plate'

  useSeo({
    title: product?.seo?.title || product?.title
      ? `${product?.seo?.title || product?.title} | The Number Plate Shop`
      : 'Interactive Plate Builder | The Number Plate Shop',
    description:
      product?.seo?.description ||
      product?.description ||
      'Build a custom road legal or show plate and checkout securely through Shopify.',
    path: productHandle ? `/builder/${productHandle}` : '/builder',
    image: image?.url,
    jsonLd: product ? productSchema({ product, variant, image }) : undefined,
  })

  useEffect(() => {
    if (!productHandle) {
      return
    }

    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) {
        setIsLoading(true)
        setError(null)
        setProduct(null)
        setVariant(null)
        setSelectedOptions({})
      }
    })

    getProductByHandle(productHandle)
      .then((item) => {
        if (cancelled) return
        if (!item) {
          setError('This Shopify product could not be found.')
          return
        }

        const requestedVariant = variantById(item, variantParam)
        const initialVariant = requestedVariant ?? firstAvailableVariant(item)
        setProduct(item)
        setVariant(initialVariant)
        setSelectedOptions(selectedOptionsFromVariant(initialVariant))
        setPlateType(defaultPlateType(item))
      })
      .catch((err) => {
        console.error('Failed to load product:', err)
        if (!cancelled) setError('This product could not be loaded from Shopify.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [productHandle, variantParam])

  // Resolve any optional paid extras (sticky pads, badges) for this product kind.
  useEffect(() => {
    if (!product) return
    const addons = addonsForKind(productKindFor(product))
    setSelectedAddons({})
    if (!addons.length) {
      setAddonProducts(new Map())
      return
    }
    let cancelled = false
    getProductsByHandles(addons.map((addon) => addon.handle))
      .then((map) => {
        if (!cancelled) setAddonProducts(map)
      })
      .catch(() => {
        if (!cancelled) setAddonProducts(new Map())
      })
    return () => {
      cancelled = true
    }
  }, [product])

  const visibleOptions = useMemo(
    () => product?.options.filter((option) => option.name.toLowerCase() !== 'title') ?? [],
    [product]
  )

  const productKind = productKindFor(product)
  const isHouseSign = productKind === 'house-sign'
  const isPlate = productKind === 'plate'
  const isHolder = productKind === 'holder'
  const productSearchText = `${product?.title ?? ''} ${product?.productType ?? ''}`
  const isLuxuryHolder = isHolder && /\blux(?:u|e)ry\b/i.test(productSearchText)
  const showPlatePreview = productKind === 'plate'
  const showLuxuryHolderPreview = isLuxuryHolder
  const showStandardHolderPreview = isHolder && !isLuxuryHolder
  const applicableAddons = useMemo(() => addonsForKind(productKind), [productKind])

  const addonView = useMemo(
    () =>
      applicableAddons.map((addon) => {
        const resolved = addonProducts.get(addon.handle) ?? null
        const variant = resolved ? firstAvailableVariant(resolved) : null
        const priceLabel = variant
          ? money(variant.price)
          : addon.fallbackPrice
            ? money({ amount: addon.fallbackPrice, currencyCode: 'GBP' })
            : null
        return { addon, variant, priceLabel }
      }),
    [applicableAddons, addonProducts]
  )

  // Only offer an extra once it has a known price — either a real Shopify
  // product or a configured fallback. This avoids ever showing an unpriced,
  // uncharged extra (e.g. badges before their Shopify products are created).
  const visibleAddons = useMemo(() => addonView.filter((entry) => entry.priceLabel), [addonView])

  const toggleAddon = (key: string) =>
    setSelectedAddons((prev) => ({ ...prev, [key]: !prev[key] }))
  const configOption = useMemo(
    () => visibleOptions.find((option) => isConfigurationOption(option)),
    [visibleOptions]
  )
  // House signs may already carry colour options in Shopify (variant-priced);
  // only show free-text colour boxes when Shopify does not provide them.
  const hasShopifyBackgroundColour = visibleOptions.some(
    (option) => /background/i.test(option.name) && /colou?r/i.test(option.name)
  )
  const hasShopifyWritingColour = visibleOptions.some(
    (option) => /(writing|text|letter)/i.test(option.name) && /colou?r/i.test(option.name)
  )

  const currentPrice = variant ? money(variant.price) : 'Unavailable'
  const productPreviewImage = product ? productImage(product, variant) : null
  const checkoutBusy = cartLoading || isPreparingCheckout
  const requiredTextMissing = isHouseSign
    ? !signText.trim()
    : isPlate
      ? !registration.trim()
      : isHolder
        ? !holderRegistration.trim() || (isLuxuryHolder && !holderText.trim())
        : false

  const updateOption = (name: string, value: string) => {
    if (!product) return
    const next = { ...selectedOptions, [name]: value }
    const nextVariant = variantByOptions(product, next)
    setSelectedOptions(next)
    if (nextVariant) setVariant(nextVariant)
  }

  const handleCheckout = async () => {
    if (!variant || checkoutRequestRef.current) return
    checkoutRequestRef.current = true
    setIsPreparingCheckout(true)
    clearError()

    // Resolve selected extras: real Shopify variants become their own paid
    // cart lines; any not yet created in Shopify are recorded on the main line
    // so the order still captures the request.
    const addonLines: CartLineInput[] = []
    const requestedExtras: string[] = []
    addonView.forEach(({ addon, variant: addonVariant }) => {
      if (!selectedAddons[addon.key]) return
      if (addonVariant) {
        addonLines.push({
          merchandiseId: addonVariant.id,
          quantity,
          attributes: [
            {
              key: '_for',
              value: registration.trim() || holderRegistration.trim() || holderText.trim() || styleLabel,
            },
          ],
        })
      } else {
        requestedExtras.push(addon.label)
      }
    })

    const mainAttributes: Attribute[] = customLineAttributes({
      registration: isPlate ? registration : isHolder ? holderRegistration : undefined,
      plateStyle: styleLabel,
      plateType: isPlate ? plateType : undefined,
      configuration: isPlate && !configOption ? configuration : undefined,
      holderText: isLuxuryHolder ? holderText : undefined,
      signText: isHouseSign ? signText : undefined,
      writingColour: isHouseSign ? writingColour : undefined,
      backgroundColour: isHouseSign ? backgroundColour : undefined,
      notes,
      selectedOptions: variant.selectedOptions,
    })
    if (requestedExtras.length) {
      mainAttributes.push({ key: '_requested_extras', value: requestedExtras.join(', ') })
    }

    try {
      await addToCart([
        { merchandiseId: variant.id, quantity, attributes: mainAttributes },
        ...addonLines,
      ])
      closeCart()
      navigate('/checkout')
    } catch {
      // Cart context exposes the error message in the builder panel.
    } finally {
      checkoutRequestRef.current = false
      setIsPreparingCheckout(false)
    }
  }

  if (!productHandle) {
    return (
      <main className="storefront-page builder-empty">
        <div className="section-shell">
          <h1>Choose a product to customize</h1>
          <p>Select a live Shopify product first, then the builder will open with its options and pricing.</p>
          <Link to="/categories/number-plates" className="button-primary">
            Browse number plates
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="storefront-page builder-empty">
        <div className="catalog-state">
          <Loader2 className="spin" size={28} aria-hidden="true" />
          <p>Loading product from Shopify.</p>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="storefront-page builder-empty">
        <div className="section-shell">
          <h1>Product unavailable</h1>
          <p>{error ?? 'This product is not available in Shopify right now.'}</p>
          <Link to="/categories/number-plates" className="button-secondary">
            Back to products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="storefront-page builder-page">
      <div className="section-shell">
        <Link to="/categories/number-plates" className="back-link">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to products
        </Link>

        <section className="builder-workspace">
          <div className="builder-preview-panel">
            {showPlatePreview && (
              <>
                <PlatePreview registration={registration} styleLabel={styleLabel} side={plateSide} />
                <div className="builder-side-toggle" aria-label="Plate side preview">
                  <button
                    type="button"
                    className={plateSide === 'front' ? 'is-active' : ''}
                    onClick={() => setPlateSide('front')}
                  >
                    Front
                  </button>
                  <button
                    type="button"
                    className={plateSide === 'rear' ? 'is-active' : ''}
                    onClick={() => setPlateSide('rear')}
                  >
                    Rear
                  </button>
                </div>
              </>
            )}
            {showLuxuryHolderPreview && (
              <PlateHolderPreview
                holderText={holderText}
                registration={holderRegistration}
                styleLabel={styleLabel}
              />
            )}
            {showStandardHolderPreview && (
              <PlatePreview registration={holderRegistration} styleLabel={styleLabel} side="rear" />
            )}
            {productPreviewImage && (
              <img
                className="builder-product-image"
                src={imageUrl(productPreviewImage, { width: 900 })}
                alt={productAlt(product, variant?.title)}
                width={productPreviewImage.width ?? 900}
                height={productPreviewImage.height ?? 675}
                loading={showPlatePreview || isHolder ? 'lazy' : 'eager'}
                decoding="async"
              />
            )}
          </div>

          <div className="builder-options-panel">
            <div className="builder-title">
              <p>Interactive builder</p>
              <h1>{product.title}</h1>
              <span>{currentPrice}</span>
            </div>

            {cartError && (
              <div className="builder-error">
                <AlertCircle size={18} aria-hidden="true" />
                <p>{cartError}</p>
              </div>
            )}

            {isHouseSign && (
              <>
                <section className="builder-card" aria-labelledby="sign-text-heading">
                  <h2 id="sign-text-heading">Name &amp; address for your sign</h2>
                  <label className="field-label" htmlFor="sign-text">
                    Write down the exact name and address you want on the sign
                  </label>
                  <textarea
                    id="sign-text"
                    className="builder-input builder-textarea"
                    value={signText}
                    onChange={(event) => setSignText(event.target.value)}
                    placeholder="SANGHA&#10;15 Hamilton Drive"
                  />
                </section>

                {(!hasShopifyWritingColour || !hasShopifyBackgroundColour) && (
                  <section className="builder-card" aria-labelledby="sign-colours-heading">
                    <h2 id="sign-colours-heading">Sign colours</h2>
                    {!hasShopifyWritingColour && (
                      <>
                        <label className="field-label" htmlFor="writing-colour">
                          Colour of writing
                        </label>
                        <input
                          id="writing-colour"
                          className="builder-input"
                          value={writingColour}
                          onChange={(event) => setWritingColour(event.target.value)}
                          maxLength={40}
                          placeholder="e.g. Gold"
                          autoComplete="off"
                        />
                      </>
                    )}
                    {!hasShopifyBackgroundColour && (
                      <>
                        <label className="field-label" htmlFor="background-colour">
                          Background colour
                        </label>
                        <input
                          id="background-colour"
                          className="builder-input"
                          value={backgroundColour}
                          onChange={(event) => setBackgroundColour(event.target.value)}
                          maxLength={40}
                          placeholder="e.g. Black"
                          autoComplete="off"
                        />
                      </>
                    )}
                  </section>
                )}
              </>
            )}

            {isPlate && (
              <section className="builder-card" aria-labelledby="registration-heading">
                <h2 id="registration-heading">Registration text</h2>
                <label className="field-label" htmlFor="registration">
                  Enter the exact spacing required
                </label>
                <input
                  id="registration"
                  className="builder-input"
                  value={registration}
                  onChange={(event) => setRegistration(event.target.value)}
                  maxLength={12}
                  placeholder="X24 GUR"
                  autoComplete="off"
                />
              </section>
            )}

            {isHolder && (
              <section className="builder-card" aria-labelledby="holder-registration-heading">
                <h2 id="holder-registration-heading">Plate registration</h2>
                <label className="field-label" htmlFor="holder-registration">
                  Enter the registration shown in the holder preview
                </label>
                <input
                  id="holder-registration"
                  className="builder-input"
                  value={holderRegistration}
                  onChange={(event) => setHolderRegistration(event.target.value)}
                  maxLength={12}
                  placeholder="X24 GUR"
                  autoComplete="off"
                />
              </section>
            )}

            {isLuxuryHolder && (
              <section className="builder-card" aria-labelledby="holder-text-heading">
                <h2 id="holder-text-heading">Holder text</h2>
                <label className="field-label" htmlFor="holder-text">
                  Enter the name or wording for the 3D gel holder
                </label>
                <input
                  id="holder-text"
                  className="builder-input"
                  value={holderText}
                  onChange={(event) => setHolderText(event.target.value)}
                  maxLength={18}
                  placeholder="BHANDAL"
                  autoComplete="off"
                />
              </section>
            )}

            {isPlate && (
              <section className="builder-card" aria-labelledby="plate-type-heading">
                <h2 id="plate-type-heading">Plate use</h2>
                <div className="segmented-control">
                  {(['Road Legal', 'Show Plate'] satisfies PlateType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={plateType === type ? 'is-active' : ''}
                      onClick={() => setPlateType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {productKind === 'plate' && !configOption && (
              <section className="builder-card" aria-labelledby="configuration-heading">
                <h2 id="configuration-heading">Configuration</h2>
                <div className="option-grid option-grid--three">
                  {['Front and Rear', 'Front Only', 'Rear Only'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={configuration === item ? 'option-tile is-active' : 'option-tile'}
                      onClick={() => setConfiguration(item)}
                    >
                      <Check size={16} aria-hidden="true" />
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {visibleOptions.map((option) => {
              const optionId = `${option.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-heading`

              return (
                <section className="builder-card" key={option.name} aria-labelledby={optionId}>
                  <h2 id={optionId}>{option.name}</h2>
                  <div className="option-grid">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={
                          selectedOptions[option.name] === value
                            ? 'option-tile is-active'
                            : 'option-tile'
                        }
                        onClick={() => updateOption(option.name, value)}
                      >
                        <Check size={16} aria-hidden="true" />
                        {value}
                      </button>
                    ))}
                  </div>
                </section>
              )
            })}

            {visibleAddons.length > 0 && (
              <section className="builder-card" aria-labelledby="addons-heading">
                <h2 id="addons-heading">Optional extras</h2>
                <div className="addon-list">
                  {visibleAddons.map(({ addon, priceLabel }) => {
                    const checked = Boolean(selectedAddons[addon.key])
                    return (
                      <button
                        type="button"
                        key={addon.key}
                        className={checked ? 'addon-row is-active' : 'addon-row'}
                        onClick={() => toggleAddon(addon.key)}
                        aria-pressed={checked}
                      >
                        <span className="addon-check" aria-hidden="true">
                          {checked && <Check size={14} />}
                        </span>
                        <span className="addon-copy">
                          <span className="addon-label">{addon.label}</span>
                          <span className="addon-desc">{addon.description}</span>
                        </span>
                        {priceLabel && <span className="addon-price">+{priceLabel}</span>}
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            <section className="builder-card" aria-labelledby="notes-heading">
              <h2 id="notes-heading">Order notes</h2>
              <textarea
                className="builder-input builder-textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any fitting notes or special finish requests."
              />
            </section>

            {productKind === 'plate' && (
              <div className="builder-reminder" role="note">
                <AlertCircle size={18} aria-hidden="true" />
                <p>
                  Want plate holders too?{' '}
                  <Link to="/categories/plate-holders">Add them to your cart</Link> before you
                  check out.
                </p>
              </div>
            )}

            <section className="builder-card builder-summary" aria-labelledby="summary-heading">
              <h2 id="summary-heading">Checkout summary</h2>
              <div>
                <span>{variant?.title ?? product.title}</span>
                <strong>{currentPrice}</strong>
              </div>
              <div className="quantity-control" aria-label="Quantity">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                  <Minus size={18} aria-hidden="true" />
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => value + 1)}>
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                className="button-primary builder-checkout"
                onClick={handleCheckout}
                disabled={!variant || checkoutBusy || requiredTextMissing}
              >
                {checkoutBusy ? (
                  <>
                    <Loader2 className="spin" size={18} aria-hidden="true" />
                    Preparing checkout
                  </>
                ) : (
                  <>
                    Continue to checkout
                    <ChevronRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>
            </section>
          </div>
        </section>
      </div>

      <div className="builder-mobile-summary">
        <span>{currentPrice}</span>
        <button
          type="button"
          className="button-primary"
          onClick={handleCheckout}
          disabled={!variant || checkoutBusy || requiredTextMissing}
        >
          {checkoutBusy ? 'Preparing' : 'Checkout'}
        </button>
      </div>
    </main>
  )
}
