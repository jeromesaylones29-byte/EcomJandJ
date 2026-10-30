# J&J Computer Shop (Supabase edition)

1. Create a project at supabase.com.
2. SQL Editor: run `supabase/schema.sql`, then `supabase/seed.sql` (44 products).
   Already set up before? Run `supabase/update_messages.sql` once so the Contact form can save messages.
3. Authentication > Providers: keep Email enabled. For instant sign-in while testing, turn off "Confirm email".
4. Project Settings > API: copy the Project URL and anon public key into `config.js`.
5. Host the folder on any static host (Netlify, Vercel, GitHub Pages) or run `npx serve .` locally.

Accounts, carts, orders, contact messages, order tracking and returns are stored in Supabase.
Prices and stock are validated server-side in the `place_order` function. Manage products and
view orders/messages in the Supabase Table Editor. Until config.js is filled in, the site shows
the built-in catalog from ItemList.js and checkout is disabled.

## How the code fits together

Load order on every page: `supabase-js (CDN)` > `config.js` > `ItemList.js` (fallback catalog) > `db.js` > `ui3d.js` > `app.js` > `auth.js` > `hero3d.js` (home only).

| File | Job | Supabase table / function |
|------|-----|---------------------------|
| `db.js` | Creates the client, loads products, syncs cart, handles tracking / returns / newsletter forms | `products`, `cart_items`, `rma_requests`, `newsletter_subscribers`, `track_order()` |
| `contact.html` (inline script) | Validates and saves the Contact form | `messages` |
| `app.js` | Renders cards, shop filters, product page, cart, summary, shipping tools | reads the catalog `db.js` loaded |
| `auth.js` | Sign up / in / out, profile, orders tab, checkout dialog | Supabase Auth, `profiles`, `orders`, `order_items`, `place_order()` |
| `ui3d.js`, `hero3d.js` | Card tilt, home-page 3D coverflow | none |
| `theme.css`, `glass.css`, `stage.css` | Design layers, loaded in that order after `styles.css` | none |

Data relations: `auth.users` 1-1 `profiles`; `auth.users` 1-many `cart_items`, `orders`; `orders` 1-many `order_items`; `products` 1-many `cart_items` (and referenced by `order_items.product_id`).
Flow: browse (`products`) > add to cart (`cart_items`) > checkout (`place_order` writes `orders` + `order_items`, lowers stock, clears the cart) > My Orders / tracking.
