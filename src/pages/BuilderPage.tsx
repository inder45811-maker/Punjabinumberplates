import { useEffect, useMemo, useState } from 'react'
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
import PlatePreview from '../components/PlatePreview'
import { readableStyleFromProductTitle } from '../lib/catalog'
import {
  customLineAttributes,
  firstAvailableVariant,
  getProductByHandle,
  imageUrl,
  money,
  productImage,
  variantById,
  variantByOptions,
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
  const [plateType, setPlateType] = useState<PlateType>('Road Legal')
  const [plateSide, setPlateSide] = useState<PlateSide>('rear')
  const [configuration, setConfiguration] = useState('Front and Rear')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(Boolean(productHandle))
  const [error, setError] = useState<string | null>(null)

  const image = product ? productImage(product, variant) : null
  const styleLabel = product ? readableStyleFromProductTitle(product.title) || product.title : 'Custom plate'

  useSeo({
    title: product?.seo?.title || product?.title
      ? `${product?.seo?.title || product?.title} | Punjabi Number Plates`
      : 'Interactive Plate Builder | Punjabi Number Plates',
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

  const visibleOptions = useMemo(
    () => product?.options.filter((option) => option.name.toLowerCase() !== 'title') ?? [],
    [product]
  )

  const currentPrice = variant ? money(variant.price) : 'Unavailable'
  const productPreviewImage = product ? productImage(product, variant) : null

  const updateOption = (name: string, value: string) => {
    if (!product) return
    const next = { ...selectedOptions, [name]: value }
    const nextVariant = variantByOptions(product, next)
    setSelectedOptions(next)
    if (nextVariant) setVariant(nextVariant)
  }

  const handleCheckout = async () => {
    if (!variant) return
    clearError()
    try {
      await addToCart({
        merchandiseId: variant.id,
        quantity,
        attributes: customLineAttributes({
          registration,
          plateStyle: styleLabel,
          plateType,
          configuration,
          notes,
          selectedOptions: variant.selectedOptions,
        }),
      })
      closeCart()
      navigate('/checkout')
    } catch {
      // Cart context exposes the error message in the builder panel.
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
            {productPreviewImage && (
              <img
                className="builder-product-image"
                src={imageUrl(productPreviewImage, { width: 900 })}
                alt={productAlt(product, variant?.title)}
                width={productPreviewImage.width ?? 900}
                height={productPreviewImage.height ?? 675}
                loading="lazy"
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

            <section className="builder-card" aria-labelledby="notes-heading">
              <h2 id="notes-heading">Order notes</h2>
              <textarea
                className="builder-input builder-textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any fitting notes or special finish requests."
              />
            </section>

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
                disabled={!variant || cartLoading || !registration.trim()}
              >
                {cartLoading ? (
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
          disabled={!variant || cartLoading || !registration.trim()}
        >
          Checkout
        </button>
      </div>
    </main>
  )
}
