import { type ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppChat from './WhatsAppChat'
import CartDrawer from './CartDrawer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="app-content">
        {children}
      </div>
      <Footer />
      <WhatsAppChat />
      <CartDrawer />
    </>
  )
}
