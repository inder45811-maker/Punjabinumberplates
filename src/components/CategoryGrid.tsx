import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { categories, type CategorySlug } from '../lib/catalog'
import { imageUrl, type StorefrontImage } from '../lib/shopify'

export type CategoryPreviewMap = Partial<Record<CategorySlug, StorefrontImage | null>>

interface CategoryGridProps {
  previews?: CategoryPreviewMap
}

export default function CategoryGrid({ previews = {} }: CategoryGridProps) {
  return (
    <section className="category-directory" aria-labelledby="category-directory-title">
      <div className="section-shell">
        <div className="section-heading">
          <p>Shop by category</p>
          <h2 id="category-directory-title">Choose your build path</h2>
        </div>

        <div className="category-grid">
          {categories.map((category) => {
            const preview = previews[category.slug]

            return (
              <Link
                key={category.slug}
                to={`/categories/${category.slug}`}
                className="category-tile group"
              >
                <div className="category-tile__media">
                  {preview ? (
                    <img
                      src={imageUrl(preview, { width: 640 })}
                      alt={`${category.label} product preview from Punjabi Number Plates`}
                      width={preview.width ?? 640}
                      height={preview.height ?? 480}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="category-tile__placeholder">Live Shopify category</div>
                  )}
                </div>
                <div className="category-tile__content">
                  <h2>{category.label}</h2>
                  <p>{category.description}</p>
                  <span>
                    View category
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
