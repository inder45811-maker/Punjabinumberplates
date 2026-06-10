import { Link } from 'react-router'
import { categories } from '../lib/catalog'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell site-footer__grid">
        <div>
          <Link to="/" className="site-logo site-logo--footer">
            <img src="/logo-tnps.svg" alt="The Number Plate Shop" width="40" height="40" />
            <span>The Number Plate Shop</span>
          </Link>
          <p>
            Premium custom number plates, plate holders, accessories, and gifts with
            secure Shopify checkout.
          </p>
        </div>

        <nav aria-label="Footer categories">
          <h2>Shop</h2>
          {categories.map((category) => (
            <Link key={category.slug} to={`/categories/${category.slug}`}>
              {category.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Footer information">
          <h2>Information</h2>
          <Link to="/legal">DVLA guide</Link>
          <Link to="/legal">Delivery and returns</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div>
          <h2>Payment</h2>
          <p>Card payments are completed through secure native Shopify Checkout.</p>
          <div className="payment-strip" aria-label="Supported card payments">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>The Number Plate Shop 2026</span>
      </div>
    </footer>
  )
}
