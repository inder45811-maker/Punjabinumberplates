/**
 * SHOPIFY BUY BUTTON DEMO
 * ========================
 * This component shows what a Shopify Buy Button looks like when embedded.
 * 
 * INSTRUCTIONS:
 * 1. In your Shopify admin, go to Settings > Apps and sales channels
 * 2. Add "Buy Button" sales channel
 * 3. Create a Buy Button for your product
 * 4. Copy the embed code (div + script)
 * 5. Paste the div ID below where it says "YOUR_DIV_ID_HERE"
 * 6. Paste the script in index.html (in the <head> or before closing </body>)
 * 
 * SHOPIFY DOMAIN: This is your-store.myshopify.com
 * ACCESS TOKEN: Generated from Shopify Admin > Settings > Apps > Private apps
 * PRODUCT ID: Found in Shopify admin > Products > click product > URL ends with .../products/123456
 */

import { useEffect, useRef } from 'react'

interface ShopifyBuyButtonProps {
  productId: string
  variantId?: string
  buttonText?: string
}

export default function ShopifyBuyButton({ 
  productId, 
  buttonText = 'ADD TO CART' 
}: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is the embed pattern Shopify generates
    // You'll need to:
    // 1. Replace 'YOUR_DOMAIN' with your actual Shopify domain (e.g., 'punjabi-number-plates.myshopify.com')
    // 2. Replace 'YOUR_API_KEY' with your Storefront API access token
    // 
    // To get the API key:
    // Shopify Admin > Settings > Apps and sales channels > Develop apps > Create app
    // > Configuration > Storefront API integration > Save > Install app > Reveal token

    if (!containerRef.current) return

    // Create unique container ID
    const containerId = `shopify-buy-button-${productId}`
    containerRef.current.id = containerId

    // The Shopify Buy Button SDK will render into this container
    // The actual initialization script needs to be loaded in index.html
    //
    // ADD THIS SCRIPT TO index.html (before closing </body>):
    //
    // <script type="text/javascript">
    // /* <![CDATA[ */
    // (function () {
    //   var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    //   if (window.ShopifyBuy) {
    //     if (window.ShopifyBuy.UI) {
    //       ShopifyBuyInit();
    //     } else {
    //       loadScript();
    //     }
    //   } else {
    //     loadScript();
    //   }
    //   function loadScript() {
    //     var script = document.createElement('script');
    //     script.async = true;
    //     script.src = scriptURL;
    //     (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    //     script.onload = ShopifyBuyInit;
    //   }
    //   function ShopifyBuyInit() {
    //     var client = ShopifyBuy.buildClient({
    //       domain: 'YOUR_SHOPIFY_DOMAIN.myshopify.com',
    //       storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN',
    //     });
    //     ShopifyBuy.UI.onReady(client).then(function (ui) {
    //       // Products will be initialized from each component instance
    //     });
    //   }
    // })();
    // /* ]]> */
    // </script>

    // Initialize this specific product button
    const initButton = () => {
      const w = window as any
      if (w.ShopifyBuy && w.ShopifyBuy.UI && w.ShopifyBuyInit) {
        // Button will be styled to match the site's dark theme
        const client = w.ShopifyBuy.buildClient({
          domain: 'YOUR_SHOPIFY_DOMAIN.myshopify.com',
          storefrontAccessToken: 'YOUR_STOREFRONT_ACCESS_TOKEN',
        })

        w.ShopifyBuy.UI.onReady(client).then(function (ui: any) {
          ui.createComponent('product', {
            id: [parseInt(productId)],
            node: document.getElementById(containerId),
            moneyFormat: '%C2%A3%7B%7Bamount%7D%7D',
            options: {
              product: {
                iframe: false, // Render inline, not in iframe (crucial for styling)
                contents: {
                  img: false,        // We show our own images
                  title: false,      // We show our own title
                  price: false,      // We show our own price
                  description: false, // We show our own description
                  button: true,      // Only show the buy button
                  buttonWithQuantity: true,
                },
                text: {
                  button: buttonText,
                  outOfStock: 'Out of stock',
                  unavailable: 'Unavailable',
                },
                styles: {
                  button: {
                    'background-color': '#ffd700',
                    'color': '#050401',
                    'font-family': 'Inter, system-ui, sans-serif',
                    'font-size': '14px',
                    'font-weight': '700',
                    'padding': '16px 32px',
                    'border-radius': '10px',
                    'border': 'none',
                    'text-transform': 'uppercase',
                    'letter-spacing': '0.05em',
                    'width': '100%',
                    'cursor': 'pointer',
                    ':hover': {
                      'background-color': '#e5c100',
                    },
                  },
                  quantity: {
                    'border-color': '#333',
                    'background-color': '#111',
                    'color': '#f2f3f4',
                  },
                  quantityButton: {
                    'background-color': '#222',
                    'color': '#f2f3f4',
                    'border-color': '#333',
                  },
                },
              },
              cart: {
                iframe: true, // Cart in modal
                startOpen: false,
                styles: {
                  button: {
                    'background-color': '#ffd700',
                    'color': '#050401',
                  },
                  title: {
                    'color': '#f2f3f4',
                  },
                  close: {
                    'color': '#f2f3f4',
                  },
                  header: {
                    'background-color': '#111',
                    'color': '#f2f3f4',
                  },
                  lineItems: {
                    'background-color': '#111',
                    'color': '#f2f3f4',
                  },
                  subtotalText: {
                    'color': '#f2f3f4',
                  },
                  subtotalMoney: {
                    'color': '#ffd700',
                  },
                  footer: {
                    'background-color': '#111',
                  },
                },
                text: {
                  title: 'YOUR BAG',
                  total: 'TOTAL',
                  button: 'CHECKOUT',
                  empty: 'Your bag is empty.',
                  notice: '',
                },
              },
              modal: {
                iframe: true,
                styles: {
                  overlay: {
                    'background-color': 'rgba(0, 0, 0, 0.8)',
                  },
                },
              },
            },
          })
        })
      }
    }

    // Wait for Shopify SDK to load
    const checkInterval = setInterval(() => {
      const w = window as any
      if (w.ShopifyBuy && w.ShopifyBuy.UI) {
        clearInterval(checkInterval)
        initButton()
      }
    }, 100)

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkInterval)
    }, 10000)

    return () => {
      clearInterval(checkInterval)
      clearTimeout(timeout)
    }
  }, [productId, buttonText])

  return <div ref={containerRef} style={{ width: '100%' }} />
}

/**
 * WHAT THE SHOPIFY CHECKOUT LOOKS LIKE
 * =====================================
 * 
 * When a customer clicks the Buy Button, here's what happens:
 * 
 * 1. Customer clicks "ADD TO CART" on your site
 * 2. A Shopify cart modal slides in from the right (styled dark to match)
 * 3. Customer can add more items or proceed to checkout
 * 4. Clicking "CHECKOUT" opens Shopify's checkout page
 * 
 * THE SHOPIFY CHECKOUT PAGE:
 * - Has YOUR logo at the top
 * - Shows YOUR brand colors (customizable in Shopify admin)
 * - Shows: Contact info, Shipping address, Payment method
 * - Payment via: Apple Pay, Google Pay, Shop Pay, Credit Card, PayPal
 * - After purchase: Order confirmation + email receipt
 * 
 * YOU CAN CUSTOMIZE THE CHECKOUT in Shopify:
 * Admin > Settings > Checkout > Customize
 * - Add your logo
 * - Change colors (make it black/gold to match)
 * - Change fonts
 * - Add trust badges
 * - Add custom scripts (for tracking)
 * 
 * EXAMPLE CHECKOUT STYLING:
 * Background: #050401 (dark)
 * Text: #f2f3f4 (white)
 * Buttons: #ffd700 (gold)
 * Form fields: #111111 (dark gray)
 * Accents: #ffd700 (gold)
 */
