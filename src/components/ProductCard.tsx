import { Link } from 'react-router'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import {
  firstAvailableVariant,
  imageUrl,
  money,
  productImage,
  type StorefrontProduct,
} from '../lib/shopify'
import { productAlt } from '../lib/seo'

interface ProductCardProps {
  product: StorefrontProduct
  eager?: boolean
}

export default function ProductCard({ product, eager = false }: ProductCardProps) {
  const variant = firstAvailableVariant(product)
  const image = productImage(product, variant)
  const href = variant
    ? `/builder/${product.handle}?variant=${encodeURIComponent(variant.id)}`
    : `/builder/${product.handle}`

  return (
    <article className="product-card group">
      <Link to={href} className="product-card__image" aria-label={`Customize ${product.title}`}>
        {image ? (
          <img
            src={imageUrl(image, { width: 720 })}
            alt={productAlt(product, variant?.title)}
            width={image.width ?? 720}
            height={image.height ?? 540}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <div className="product-card__empty">PNP</div>
        )}
      </Link>

      <div className="product-card__body">
        <div>
          <h3>{product.title}</h3>
          <p>{product.availableForSale ? 'Available now' : 'Currently unavailable'}</p>
        </div>

        <div className="product-card__meta">
          <span>{variant ? money(variant.price) : 'View options'}</span>
          {product.availableForSale && (
            <span className="product-card__stock">
              <CheckCircle2 size={15} aria-hidden="true" />
              In stock
            </span>
          )}
        </div>

        <Link to={href} className="product-card__cta">
          Add to Builder
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
