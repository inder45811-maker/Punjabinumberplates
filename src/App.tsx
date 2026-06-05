import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Product from './pages/Product'
import PlateHolders from './pages/PlateHolders'
import Keyrings from './pages/Keyrings'
import Checkout from './pages/Checkout'
import Gallery from './pages/Gallery'
import Legal from './pages/Legal'
import Contact from './pages/Contact'
import About from './pages/About'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/plate-holders" element={<PlateHolders />} />
        <Route path="/keyrings" element={<Keyrings />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
    </CartProvider>
  )
}
