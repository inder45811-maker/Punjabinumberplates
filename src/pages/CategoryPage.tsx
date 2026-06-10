import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { categoryBySlug, type CategorySlug } from '../lib/catalog'
import { getProductsByCollectionHandles, type StorefrontProduct } from '../lib/shopify'
import { useSeo } from '../lib/seo'

function isCategorySlug(value: string | undefined): value is CategorySlug {
  return Boolean(value && categoryBySlug.has(value as CategorySlug))
}

export default function CategoryPage() {
  const { slug } = useParams()
  const category = isCategorySlug(slug) ? categoryBySlug.get(slug) : undefined
  const [products, setProducts] = useState<StorefrontProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useSeo({
    title: category?.seoTitle ?? 'Shop Categories | The Number Plate Shop',
    description:
      category?.seoDescription ??
      'Browse live Shopify categories from The Number Plate Shop.',
    path: category ? `/categories/${category.slug}` : '/categories',
  })

  const handles = useMemo(() => category?.collectionHandles ?? [], [category])

  useEffect(() => {
    if (!category) return
    let cancelled = false

    Promise.resolve().then(() => {
      if (!cancelled) {
        setIsLoading(true)
        setError(null)
        setProducts([])
      }
    })

    getProductsByCollectionHandles(handles)
      .then((items) => {
        if (!cancelled) setProducts(items)
      })
      .catch((err) => {
        console.error('Failed to load category products:', err)
        if (!cancelled) setError('This Shopify category could not be loaded.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category, handles])

  if (!category) return <Navigate to="/" replace />

  return (
    <main className="storefront-page">
      <section className="category-hero">
        <div className="section-shell">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to home
          </Link>
          <p>{category.shortLabel}</p>
          <h1>{category.label}</h1>
          <span>{category.description}</span>
        </div>
      </section>

      <section className="products-section" aria-labelledby="products-heading">
        <div className="section-shell">
          <div className="section-heading">
            <p>Live Shopify catalogue</p>
            <h2 id="products-heading">{category.label}</h2>
          </div>

          {isLoading && (
            <div className="catalog-state">
              <Loader2 className="spin" size={26} aria-hidden="true" />
              <p>Loading products from Shopify.</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="catalog-state">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && products.length === 0 && (
            <div className="catalog-state">
              <h3>No live products yet</h3>
              <p>
                This category is ready on the storefront. Add matching products to the
                Shopify collection and they will appear here automatically.
              </p>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} eager={index < 3} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
