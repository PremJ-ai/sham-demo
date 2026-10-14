# Atelier Pierre — Grey Elegance Restaurant Website

Static responsive website recreated from the supplied Stitch design/code package.

## Run

Open `index.html` directly in a browser, or serve the folder with any static web server.

Example:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Included

- Responsive desktop/tablet/mobile layout
- Atelier Pierre editorial visual system
- EB Garamond + Hanken Grotesk typography
- Limestone/charcoal palette
- Hero, reservation bar, philosophy, seasonal highlights, private dining, cellar/night lounge, reservation CTA and footer
- Mobile navigation
- Smooth anchor navigation
- Lightweight form feedback for reservation/newsletter actions

The culinary photography URLs remain the same as the supplied reference implementation because the uploaded package contained screenshots rather than the original photo files.


## Atelier Formel — menswear storefront demo

Preview: https://premj-ai.github.io/sham-demo/atelier-formel/

The separate Atelier Formel storefront is inspired by the supplied editorial menswear layout. It has distinct pages for formal shirts, casual shirts, formal trousers and chinos; responsive layout; paced reveal and hover animations; collection filters and sorting; a demo bag, search and wishlist; and an interactive outfit pairing. Source code for the React/Next.js app and its mock product API is in [`atelier-formel-source/`](atelier-formel-source/).

**Demo notice:** product names, prices and testimonials are sample content; checkout does not collect money. GitHub Pages hosts the static demo only; run the Next.js project with Node.js to use its `/api/products` route.
