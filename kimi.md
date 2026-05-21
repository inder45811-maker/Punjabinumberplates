# Kimi — Punjabi Number Plates (PNP) Website

> Role: Frontend Architect & UX Engineer for PNP
> Directive: Build, maintain, and optimise the Punjabi Number Plates website. Every pixel serves conversion. Every interaction is an opportunity. Mobile is not an afterthought — it is the primary viewport.

---

## 1. Project Overview

**Brand:** Punjabi Number Plates (PNP)  
**Tagline:** "Your Reg, Your Rule."  
**Industry:** UK number plate manufacturing & fitting  
**Location:** London, UK  
**Website:** https://punjabinumberplates.co.uk

**Current Stack:**
- React 19 + TypeScript (Vite v7.2.4)
- Three.js (3D plate preview with ExtrudeGeometry + OrbitControls)
- Tailwind CSS v3.4.19 (global styles only — inline styles for components)
- HashRouter (SPA — no SSR)
- shadcn/ui (installed, minimal usage)

**Live Deployment:** https://467v7zg2x5qhq.kimi.page

---

## 2. Tech Stack Rules

### What We Use
- **React 19** with hooks (useState, useEffect, useRef, useCallback, useMemo)
- **TypeScript** — strict mode where possible
- **Vite** for bundling (not Next.js — we are a SPA)
- **Three.js** — FontLoader, TextGeometry, ExtrudeGeometry, OrbitControls
- **GSAP** — ScrollTrigger for scroll animations
- **Inline styles** — primary styling method (not Tailwind classes)
- **CSS media queries** — only as fallback when inline styles can't override
- **isMobile state pattern** — `const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768`

### What We DON'T Use
- No Next.js (SSR not available in sandbox)
- No backend (frontend SPA only)
- No Zustand/Redux (local state only)
- No CSS-in-JS libraries
- No Tailwind utility classes on components (inline styles override media queries)

---

## 3. Branding & Design System

### Colours
```
Background:    #050401 (near-black canvas)
Surface:       #111111 (elevated sections)
Accent:        #ffd700 (gold — CTAs, prices, active states)
Text Primary:  #f2f3f4 (off-white)
Text Muted:    #757575 (secondary text)
Border:        #222222 (subtle borders)
Alert Red:     #EF4444 (errors, warnings)
```

### Typography
- **Display/Headings:** Inter, system-ui, sans-serif — fontWeight 700, letterSpacing -1.5px to -2.4px
- **Mono/Data:** JetBrains Mono — 0.12em letterSpacing, uppercase for labels
- **Plate Text:** Impact, Arial Black, Haettenschweiler — fontWeight 900, condensed
- **Scale:**
  - Hero heading: clamp(2.5rem, 8vw, 8rem)
  - Section heading: clamp(1.75rem, 3vw, 2.5rem)
  - Body: 1rem, lineHeight 1.6
  - Labels: 0.7-0.8rem, letterSpacing 0.12-0.2em, uppercase

### Spacing
- Section padding desktop: 100-120px vertical
- Section padding mobile: 40-60px vertical
- Content maxWidth: 1440px
- Container padding: 24px desktop, 16px mobile
- Grid gap: 24px desktop, 16px mobile

---

## 4. Mobile-First Rules

### The Golden Rule
**ALL inline grid/sizing styles MUST use `isMobile` conditional.**

### isMobile Pattern
```tsx
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const check = () => setIsMobile(window.innerWidth <= 768)
  check()
  window.addEventListener('resize', check)
  return () => window.removeEventListener('resize', check)
}, [])
```

### Common Mobile Overrides
```tsx
// Grid columns
gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'

// Section padding
padding: isMobile ? '40px 16px' : '100px 24px'

// Font sizes
fontSize: isMobile ? '0.85rem' : '1.1rem'

// Letter spacing (looser on mobile to prevent merging)
letterSpacing: isMobile ? '0.5px' : '-0.5px'

// Aspect ratios
aspectRatio: isMobile ? '4/3' : '1/1'

// Gaps
gap: isMobile ? '12px' : '24px'
```

### Navbar Mobile Rules
- Logo image: 28px on mobile, 36px desktop
- Brand text: "PNP" on mobile, "PUNJABI NUMBER PLATES" desktop
- Nav padding: 0 12px mobile, 0 24px desktop
- Hamburger icon: 20px on mobile
- Shopping bag icon: 18px on mobile

### What Breaks on Mobile (Checklist)
- [ ] Inline `gridTemplateColumns` without isMobile conditional
- [ ] Letter spacing tighter than -1px on mobile
- [ ] Font sizes > 2rem on mobile headings
- [ ] Padding > 60px on mobile sections
- [ ] Fixed widths > 320px
- [ ] aspect-ratio: 1/1 on product images (use 4/3 with maxHeight)

---

## 5. Pages & Routes

| Route | Page | File |
|-------|------|------|
| `/` | Home (landing) | `src/pages/Home.tsx` |
| `/product` | Product detail + configurator | `src/pages/Product.tsx` |
| `/checkout` | Multi-step checkout | `src/pages/Checkout.tsx` |
| `/gallery` | Gallery grid | `src/pages/Gallery.tsx` |
| `/about` | About PNP | `src/pages/About.tsx` |
| `/legal` | Legal/DVLA info | `src/pages/Legal.tsx` |
| `/contact` | Contact + FAQ | `src/pages/Contact.tsx` |

### Shared Components
- `src/components/Navbar.tsx` — Logo, nav links, hamburger, ticker
- `src/components/Footer.tsx` — Links, copyright, branding
- `src/components/Layout.tsx` — Wraps all pages (Navbar + Footer + ticker)
- `src/components/PlatePreview3D.tsx` — Three.js 3D plate preview

---

## 6. 3D Plate Preview System

### How It Works
- Uses **Three.js** with FontLoader + TextGeometry + ExtrudeGeometry
- Characters are rendered as actual 3D meshes with beveled edges
- OrbitControls allow drag-to-rotate the plate
- Auto-rotation shows depth without user interaction
- ResizeObserver makes canvas responsive to container width

### 4 Plate Styles
| Style | Depth | Bevel | Roughness | Price |
|-------|-------|-------|-----------|-------|
| **4D 5MM** | 0.08 | 0.02 | 0.2 | £45 |
| **4D GEL** | 0.12 | 0.05 | 0.1 | £55 |
| **3D GEL** | 0.15 | 0.08 | 0.12 | £35 |
| **GHOST** | 0.04 | 0.00 | 0.5 | £70 |

### Front/Rear Toggle
- Front = white plate (#f5f5f5)
- Rear = yellow plate (#facc15)
- Updates material colour in real-time

---

## 7. Product Data

### Current Products
```
4D 5MM Road Legal Plates  — £45  — /pnp-07.jpg
4D Gel Road Legal Plates   — £55  — /pnp-05.jpg
Ghost Road Legal Plates    — £70  — /pnp-06.jpg
Standard Number Plates     — £25  — /pnp-01.jpg
3D Gel Domed Plates        — £35  — /pnp-03.jpg
```

### All PNP Images (public/)
- `logo.png` — PNP lion logo
- `pnp-01.jpg` through `pnp-12.jpg` — Product photos
- `pnp-collection-hero.jpg` — Collection hero

### Brand References
- ALL text must say "Punjabi Number Plates" or "PNP" — never "Apex Plates"
- Email: hello@punjabinumberplates.co.uk
- Address: PUNJABI NUMBER PLATES, Unit 7, PNP Industrial Estate, 47-49 Northern Road, London N7 9BG
- Ticker: "FOLLOW US ON INSTAGRAM @PUNJABINUMBERPLATES — IN-STORE PICKUP AVAILABLE"
- Copyright: "PUNJABI NUMBER PLATES 2025"

---

## 8. Conversion & UX Rules

### CTA Design
- Background: #ffd700 (gold)
- Text: #050401 (dark)
- Border radius: 9999px (pill shape)
- Font: Inter 700, uppercase, -0.72px letterSpacing
- Hover: translateY(-2px) + gold glow shadow

### Product Page Elements
- Breadcrumb navigation
- Image gallery with thumbnails
- 3D plate preview (Three.js)
- Style selector (4D 5mm, 4D Gel, 3D Gel, Ghost)
- Front/Rear toggle
- Price: £45 base, adjusts per style
- Payment options: PayPal, Clearpay (stacked on mobile)
- Tab navigation: Info | Specs | Delivery (scrollable on mobile)
- Related products grid (2-col mobile, 4-col desktop)

### Checkout Rules
- Guest checkout always available
- 3-step progress indicator
- Sticky order summary on desktop, top on mobile
- Trust signals: SSL badge, secure checkout text

---

## 9. Performance Targets

### Bundle
- Keep initial JS < 500KB (Three.js is ~600KB, lazy-load if possible)
- Use dynamic imports for heavy components

### Images
- All PNP images served from public/ (no CDN yet)
- Use `loading="lazy"` for below-fold images
- aspect-ratio CSS property to prevent CLS

### 3D Preview
- Canvas uses ResizeObserver for responsive sizing
- Dispose geometries/materials on unmount
- Limit pixel ratio: `setPixelRatio(Math.min(window.devicePixelRatio, 2))`

---

## 10. QA Checklist (Before Every Deploy)

- [ ] No TypeScript build errors (`npm run build` passes)
- [ ] No console errors/warnings
- [ ] All PNP branding (no "Apex Plates" references)
- [ ] Mobile navbar shows "PNP" not truncated text
- [ ] 3D preview fits mobile container
- [ ] Product images not oversized on mobile
- [ ] Tab labels fully visible on mobile
- [ ] Payment pills stacked/not overflowing on mobile
- [ ] Front/Rear toggle works on all plate styles
- [ ] Related products grid: 2-col mobile, 4-col desktop
- [ ] All links functional (no 404s)
- [ ] About page ≠ Home page content
- [ ] Footer shows "PUNJABI NUMBER PLATES 2025"

---

## 11. Communication Protocol

### When Fixing Issues
1. Read the user's screenshot carefully — identify the EXACT problem
2. Check the specific file/section causing the issue
3. Use `isMobile` conditional for ALL sizing changes
4. Build before committing — fix TS errors immediately
5. Commit with clear message: `fix: mobile sizing - [description]`

### Code Style
- Self-documenting function names
- Comments explain WHY, not WHAT
- One task per commit
- Never commit broken code

---

> Final Directive: Every feature serves the customer. Every fix improves the mobile experience. We don't just build websites — we build the best number plate ordering experience in the UK.

**Project:** Punjabi Number Plates  
**Updated:** 2026-05-16
