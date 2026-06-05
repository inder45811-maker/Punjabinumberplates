import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import { CartProvider } from './context/CartContext'

const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const BuilderPage = lazy(() => import('./pages/BuilderPage'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Legal = lazy(() => import('./pages/Legal'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))

export default function App() {
  return (
    <CartProvider>
      <Layout>
        <Suspense fallback={<div className="route-loading">Loading</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/builder/:productHandle" element={<BuilderPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/product" element={<Navigate to="/categories/number-plates" replace />} />
            <Route path="/plate-holders" element={<Navigate to="/categories/plate-holders" replace />} />
            <Route path="/keyrings" element={<Navigate to="/categories/keyrings" replace />} />
            <Route path="/gallery" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </CartProvider>
  )
}
