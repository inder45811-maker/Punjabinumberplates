import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import CategoryGrid, { type CategoryPreviewMap } from '../components/CategoryGrid'
import ReviewsSection from '../components/ReviewsSection'
import { categories } from '../lib/catalog'
import {
  getCollectionPreviewsByHandles,
  type StorefrontCollectionPreview,
  type StorefrontImage,
} from '../lib/shopify'
import { organizationSchema, useSeo } from '../lib/seo'

function previewFor(collections: StorefrontCollectionPreview[]): StorefrontImage | null {
  for (const collection of collections) {
    if (collection.image) return collection.image
    const product = collection.products.nodes.find(
      (item) => item.featuredImage || item.images.nodes[0]
    )
    if (product?.featuredImage) return product.featuredImage
    if (product?.images.nodes[0]) return product.images.nodes[0]
  }
  return null
}

export default function Home() {
  const [previews, setPreviews] = useState<CategoryPreviewMap>({})

  useSeo({
    title: 'CUSTOM MADE PLATES & 4D NUMBER PLATES | +20 Styles to Choose from',
    description:
      'Shop premium road legal and show plates, plate holders, accessories, car hangings, and house plates from The Number Plate Shop.',
    path: '/',
    jsonLd: organizationSchema(),
  })

  const handles = useMemo(
    () => Array.from(new Set(categories.flatMap((category) => category.collectionHandles))),
    []
  )

  useEffect(() => {
    let cancelled = false

    getCollectionPreviewsByHandles(handles)
      .then((collections) => {
        if (cancelled) return
        const next: CategoryPreviewMap = {}
        categories.forEach((category) => {
          next[category.slug] = previewFor(
            collections.filter((collection) =>
              category.collectionHandles.includes(collection.handle)
            )
          )
        })
        setPreviews(next)
      })
      .catch((error) => {
        console.error('Failed to load category previews:', error)
      })

    return () => {
      cancelled = true
    }
  }, [handles])

  return (
    <main className="storefront-page">
      <section className="hero-home">
        <img
          src="/pnp-collection-hero.webp"
          alt=""
          width="1600"
          height="1067"
          className="hero-home__image"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-home__overlay" />
        <div className="hero-home__content">
          <img src="/logo-tnps.svg" alt="The Number Plate Shop logo" width="72" height="72" />
          <p>Custom plates made simple</p>
          <h1>Custom Made Plates & 4D Number Plates | +20 Styles to Choose from</h1>
          <div className="hero-home__actions">
            <Link to="/categories/number-plates" className="button-primary">
              Start your plate
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link to="/categories/plate-holders" className="button-secondary">
              Shop holders
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store promises">
        <div className="section-shell trust-strip__grid">
          <div>
            <ShieldCheck size={22} aria-hidden="true" />
            <span>Road legal and show plate options</span>
          </div>
          <div>
            <Sparkles size={22} aria-hidden="true" />
            <span>Premium custom finishes</span>
          </div>
          <div>
            <Truck size={22} aria-hidden="true" />
            <span>Secure Shopify checkout</span>
          </div>
        </div>
      </section>

      <CategoryGrid previews={previews} />
      <ReviewsSection />
    </main>
  )
}
