# Atelier Formel — Next.js storefront

A component-based Next.js demo for the Atelier Formel menswear concept.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/` — home, campaign, category overview and interactive wardrobe pairing
- `/collections/formal-shirts` — formal shirts
- `/collections/casual-shirts` — casual/check shirts
- `/collections/formal-trousers` — tailored trousers
- `/collections/chinos` — chinos
- `GET /api/products?category=chinos&q=navy` — searchable/filterable JSON product catalogue
- `POST /api/products` — validates product and quantity lines and returns a mock order reference

The API runs under Next.js/Node.js. GitHub Pages can host the static preview in `../atelier-formel/`, but it cannot execute this server-side route. Products, prices and campaign content are demonstration data; no payment is taken.