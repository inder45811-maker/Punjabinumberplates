import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const distDir = join(process.cwd(), 'dist')
const indexPath = join(distDir, 'index.html')
const siteUrl = 'https://www.punjabinumberplates.co.uk'
const defaultImage = `${siteUrl}/pnp-collection-hero.webp`

const routes = [
  {
    path: '/',
    title: 'CUSTOM MADE PLATES & 4D NUMBER PLATES | +20 Styles to Choose from',
    description:
      'Shop premium road legal and show plates, plate holders, accessories, car hangings, and house plates from The Number Plate Shop.',
  },
  {
    path: '/categories/number-plates',
    title: 'Custom 3D Gel & 4D Number Plates | The Number Plate Shop',
    description:
      'Shop custom road legal and show number plates from The Number Plate Shop with live Shopify prices and secure checkout.',
  },
  {
    path: '/categories/plate-holders',
    title: 'Luxury Plate Holders & 3D Gel Holders | The Number Plate Shop',
    description:
      'Browse luxury plate holders and 3D gel holders with real-time Shopify pricing from The Number Plate Shop.',
  },
  {
    path: '/categories/keyrings',
    title: 'Custom Number Plate Keyrings | The Number Plate Shop',
    description:
      'Personalised number plate keyrings from The Number Plate Shop, powered by live Shopify catalogue data.',
  },
  {
    path: '/categories/accessories',
    title: 'Number Plate Accessories & Badges | The Number Plate Shop',
    description:
      'Shop number plate accessories, symbols, badges, and decals from The Number Plate Shop.',
  },
  {
    path: '/categories/car-hangings',
    title: 'Custom Car Hangings | The Number Plate Shop',
    description:
      'Browse custom car hangings from The Number Plate Shop with live availability from Shopify.',
  },
  {
    path: '/categories/house-plates',
    title: 'Punjabi House Plates & 4D House Signs | The Number Plate Shop',
    description:
      'Shop Punjabi house plates, Sikh Khanda signs, and 4D laser cut house signs from The Number Plate Shop.',
  },
  {
    path: '/builder',
    title: 'Interactive Plate Builder | The Number Plate Shop',
    description:
      'Build a custom road legal or show plate and checkout securely through Shopify.',
  },
  {
    path: '/checkout',
    title: 'Secure Checkout | The Number Plate Shop',
    description:
      'Review your order from The Number Plate Shop, upload compliance documents when required, and continue to secure Shopify checkout.',
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
