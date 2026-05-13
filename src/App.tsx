import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'

function StubPage({ title }: { title: string }) {
  return (
    <div
      style={{
        minHeight: 'calc(100dvh - 104px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          letterSpacing: '-2.4px',
          color: '#f2f3f4',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '1rem',
          color: '#757575',
          textAlign: 'center',
        }}
      >
        Coming soon — this page is under construction.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<StubPage title="Product" />} />
        <Route path="/checkout" element={<StubPage title="Checkout" />} />
        <Route path="/gallery" element={<StubPage title="Gallery" />} />
        <Route path="/legal" element={<StubPage title="Legal" />} />
        <Route path="/contact" element={<StubPage title="Contact" />} />
      </Routes>
    </Layout>
  )
}
