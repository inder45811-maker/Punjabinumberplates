import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const distDir = join(process.cwd(), 'dist')
const indexPath = join(distDir, 'index.html')
const siteUrl = 'https://www.punjabinumberplates.co.uk'
const defaultImage = `${siteUrl}/pnp-collection-hero.webp`

const routes = [
  {
    path: '/',
    title: 'Custom 3D Gel & 4D Laser Cut Number Plates | Punjabi Number Plates',
    description:
      'Shop premium road legal and show plates, plate holders, accessories, car hangings, and house plates from Punjabi Number Plates.',
  },
  {
    path: '/categories/number-plates',
    title: 'Custom 3D Gel & 4D Number Plates | Punjabi Number Plates',
    description:
      'Shop custom road legal and show number plates from Punjabi Number Plates with live Shopify prices and secure checkout.',
  },
  {
    path: '/categories/plate-holders',
    title: 'Premium Plate Holders & Luxury Surrounds | Punjabi Number Plates',
    description:
      'Browse luxury signature plate holders and surrounds with real-time Shopify pricing from Punjabi Number Plates.',
  },
  {
    path: '/categories/keyrings',
    title: 'Custom Number Plate Keyrings | Punjabi Number Plates',
    description:
      'Personalised number plate keyrings from Punjabi Number Plates, powered by live Shopify catalogue data.',
  },
  {
    path: '/categories/accessories',
    title: 'Number Plate Accessories & Badges | Punjabi Number Plates',
    description:
      'Shop number plate accessories, symbols, badges, and decals from Punjabi Number Plates.',
  },
  {
    path: '/categories/car-hangings',
    title: 'Custom Car Hangings | Punjabi Number Plates',
    description:
      'Browse custom car hangings from Punjabi Number Plates with live availability from Shopify.',
  },
  {
    path: '/categories/house-plates',
    title: 'Punjabi House Plates & 4D House Signs | Punjabi Number Plates',
    description:
      'Shop Punjabi house plates, Sikh Khanda signs, and 4D laser cut house signs from Punjabi Number Plates.',
  },
  {
    path: '/builder',
    title: 'Interactive Plate Builder | Punjabi Number Plates',
    description:
      'Build a custom road legal or show plate and checkout securely through Shopify.',
  },
  {
    path: '/checkout',
    title: 'Secure Checkout | Punjabi Number Plates',
    description:
      'Review your Punjabi Number Plates order, upload compliance documents when required, and continue to secure Shopify checkout.',
  },
]

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function routeFile(path) {
  if (path === '/') return indexPath
  return join(distDir, path.slice(1), 'index.html')
}

function withHead(html, route) {
  const canonical = `${siteUrl}${route.path === '/' ? '/' : route.path}`
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)

  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/s, `<meta name="description" content="${description}" />`)
    .replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/s, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/s, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/s, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/s, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/s, `<meta property="og:image" content="${defaultImage}" />`)
}

const baseHtml = readFileSync(indexPath, 'utf8')

for (const route of routes) {
  const file = routeFile(route.path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, withHead(baseHtml, route))
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => `  <url><loc>${siteUrl}${route.path === '/' ? '/' : route.path}</loc></url>`)
  .join('\n')}
</urlset>
`

writeFileSync(join(distDir, 'sitemap.xml'), sitemap)
