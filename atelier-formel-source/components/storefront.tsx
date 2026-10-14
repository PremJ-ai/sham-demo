"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { collections, isCategory, products, type Category, type Product } from "@/lib/products";

const categoryLinks: { slug: Category; label: string; kicker: string }[] = [
  { slug: "formal-shirts", label: "Formal shirts", kicker: "Precision in every stitch" },
  { slug: "casual-shirts", label: "Casual shirts", kicker: "Quiet confidence, woven in" },
  { slug: "formal-trousers", label: "Formal trousers", kicker: "Clean lines, considered drape" },
  { slug: "chinos", label: "Chinos", kicker: "Off-duty, beautifully done" }
];
const money = (value: number) => "$" + Math.round(value);

type CartLine = { id: string; quantity: number };
type CartContextValue = { lines: CartLine[]; add: (id: string) => void; remove: (id: string) => void; count: number; subtotal: number };
const CartContext = createContext<CartContextValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const add = (id: string) => setLines((current) => {
    const found = current.find((line) => line.id === id);
    return found ? current.map((line) => line.id === id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { id, quantity: 1 }];
  });
  const remove = (id: string) => setLines((current) => current.filter((line) => line.id !== id));
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + (products.find((p) => p.id === line.id)?.price ?? 0) * line.quantity, 0);
  return <CartContext.Provider value={{ lines, add, remove, count, subtotal }}>{children}</CartContext.Provider>;
}
function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("DemoStoreProvider is required.");
  return value;
}
function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);
}
function Header() {
  const cart = useCart();
  const [bagOpen, setBagOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => [p.name, p.color, p.category, p.description].join(" ").toLowerCase().includes(q)).slice(0, 5) : [];
  }, [query]);
  const bagItems = cart.lines.map((line) => ({ line, product: products.find((p) => p.id === line.id)! })).filter((row) => row.product);
  return <>
    <div className="announcement">Complimentary shipping on orders over $150 <b>—</b> Thoughtful tailoring, built into every day</div>
    <header className="site-header">
      <button className="icon-button mobile-menu-toggle" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
      <nav className={"main-nav" + (mobileOpen ? " open" : "")}>{categoryLinks.map((link) => <Link key={link.slug} href={"/collections/" + link.slug} onClick={() => setMobileOpen(false)}>{link.label}</Link>)}</nav>
      <Link className="brand-lockup" href="/"><span className="brand-name">Atelier Formel</span><span className="brand-tagline">TAILORED FOR THE EVERYDAY</span></Link>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen(true)}>⌕</button>
        <button className="icon-button" aria-label="Shopping bag" onClick={() => setBagOpen(true)}>♧ <span>{cart.count}</span></button>
      </div>
    </header>
    {(bagOpen || searchOpen) && <button className="panel-scrim visible" aria-label="Close panel" onClick={() => { setBagOpen(false); setSearchOpen(false); }} />}
    {searchOpen && <aside className="search-panel open" aria-label="Product search"><div className="search-panel-head"><p className="eyebrow">Find your next favourite</p><button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Close search">×</button></div><label htmlFor="store-search">Search the collection</label><input id="store-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “white shirt” or “chinos”"/><div className="search-results">{results.map((product) => <div className="search-result" key={product.id}><img src={product.image} alt=""/><div><strong>{product.name}</strong><small>{money(product.price)} · {product.color}</small></div><button onClick={() => { cart.add(product.id); setNotice(product.name + " added to the demo bag"); }}>Quick add</button></div>)}{query && results.length === 0 && <p className="empty-bag">No matching pieces found.</p>}{!query && <p className="empty-bag">Try “shirt”, “blue” or “chino”.</p>}</div></aside>}
    {bagOpen && <aside className="bag-drawer open" aria-label="Shopping bag"><div className="drawer-head"><div><span className="eyebrow">Your edit</span><h2>Shopping bag <span>({cart.count})</span></h2></div><button className="icon-button" onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></div><div className="bag-items">{bagItems.length ? bagItems.map(({ line, product }) => <article className="bag-item" key={line.id}><img src={product.image} alt=""/><div><h3>{product.name}</h3><p>Demo item · Qty {line.quantity}</p><strong>{money(product.price * line.quantity)}</strong></div><button className="remove-item" onClick={() => cart.remove(line.id)}>Remove</button></article>) : <p className="empty-bag">Your bag is waiting for a favourite.</p>}</div><div className="drawer-foot"><div><span>Subtotal</span><strong>{money(cart.subtotal)}</strong></div><p>Demo checkout only. No payment is collected.</p><button className="button button-dark button-full" onClick={() => setNotice("This is a demo checkout — no payment was collected.")}>Continue to demo checkout ↗</button></div></aside>}
    <div className={"toast" + (notice ? " show" : "")} role="status">{notice}</div>
    {notice && <button className="sr-only" onClick={() => setNotice("")}>Dismiss message</button>}
  </>;
}
function Footer() {
  return <footer className="site-footer"><div className="footer-top"><Link className="brand-lockup footer-brand" href="/"><span className="brand-name">Atelier Formel</span><span className="brand-tagline">TAILORED FOR THE EVERYDAY</span></Link><p>Considered menswear for the everyday, wherever it takes you.</p><nav className="footer-nav">{categoryLinks.map((link) => <Link href={"/collections/" + link.slug} key={link.slug}>{link.label}</Link>)}</nav></div><div className="footer-bottom"><span>© 2026 Atelier Formel · Demo storefront</span><span>Made for real days, thoughtfully.</span></div></footer>;
}
function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  return <article className="product-card"><div className="product-image"><img src={product.image} alt={product.name} loading="lazy"/><span className="product-badge">{product.color}</span><button className={"wish-button" + (saved ? " is-saved" : "")} onClick={() => setSaved(!saved)} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}>{saved ? "♥" : "♡"}</button><button className="product-quick-add" onClick={() => { cart.add(product.id); setAdded(true); }}>{added ? "Added to bag ✓" : "Quick add · " + money(product.price)}</button></div><div className="product-info"><div className="product-meta"><span>{product.category.replaceAll("-", " ")}</span><strong>{money(product.price)}</strong></div><h3>{product.name}</h3><p>{product.description}</p><div className="swatch-row"><span className="swatch selected" style={{ backgroundColor: product.color.toLowerCase().includes("white") ? "#f5f3ed" : product.color.toLowerCase().includes("blue") || product.color.toLowerCase().includes("navy") ? "#25354a" : product.color.toLowerCase().includes("khaki") ? "#c8b89f" : "#464b50" }}/><span className="swatch" style={{ backgroundColor: "#d9d4c9" }}/><span className="product-colors">{product.color}</span></div></div></article>;
}
export function Storefront() {
  useReveal();
  const [occasion, setOccasion] = useState<"boardroom" | "smart" | "friday">("boardroom");
  const pairings = {
    boardroom: { title: "The Boardroom Duo", desc: "Crisp white poplin and the easy drape of charcoal wool.", shirt: products[0], trouser: products[4], total: 293 },
    smart: { title: "The Modern Creative Pairing", desc: "A fine micro-check introduces texture, grounded by a stone chino.", shirt: products[2], trouser: products[6], total: 263 },
    friday: { title: "The Refined Friday Cadence", desc: "Keep the crisp shirt, soften the silhouette. Desk to dinner, sorted.", shirt: products[0], trouser: products[6], total: 253 }
  };
  const pairing = pairings[occasion];
  const cart = useCart();
  return <><Header/><main>
    <section className="hero-section"><div className="hero-copy reveal"><p className="eyebrow"><span/>THE FOUNDATIONAL WARDROBE</p><h1>Form follows function.<br/><em>Tailored for every single day.</em></h1><p className="hero-description">Everyday formalwear, thoughtfully reimagined. Elevated cottons, considered silhouettes and the freedom to move from your first meeting to the last reservation.</p><div className="hero-actions"><Link className="button button-dark" href="#collections">Explore the collection ↗</Link><Link className="text-link" href="#tailoring-code">Discover our tailoring code →</Link></div><div className="spec-strip"><div><span className="spec-label">Fabric</span><strong>120/2</strong><small>Long-staple cotton</small></div><div><span className="spec-label">Movement</span><strong>4-way</strong><small>Comfort stretch</small></div><div><span className="spec-label">Finish</span><strong>Easy-care</strong><small>Made for real days</small></div><div><span className="spec-label">Fit</span><strong>Considered</strong><small>Made to move</small></div></div></div><div className="hero-visual reveal reveal-delay-2"><img src={products[0].image} alt="Crisp formalwear in a sunlit studio"/><div className="campaign-card"><div><span className="eyebrow">CAMPAIGN · AW / 26</span><strong>The studio uniform — look 01</strong><small>Savoy poplin with Burlington wool</small></div><div className="campaign-price"><strong>$293</strong><small>Complete look</small></div></div></div></section>
    <section className="value-bar"><div><span>✳</span><p>Long-staple cottons</p></div><div><span>⌁</span><p>Comfort-led construction</p></div><div><span>◌</span><p>Low-fuss finishes</p></div><div><span>↗</span><p>Complimentary fit advice</p></div></section>
    <section className="section" id="collections"><div className="section-heading"><div><p className="eyebrow">PILLAR ARCHITECTURE</p><h2>The core four.<br/><em>A better everyday wardrobe.</em></h2></div><p>Interchangeable building blocks with intentional cuts, wearable textures and a place in your everyday rotation.</p></div><div className="category-grid">{categoryLinks.map((category, index) => { const product = products.find((item) => item.category === category.slug)!; return <Link className={"category-card reveal reveal-delay-" + Math.min(index, 3)} href={"/collections/" + category.slug} key={category.slug}><div className="category-image"><img src={product.image} alt={category.label} loading="lazy"/><span className="image-tag">0{index + 1} / {category.label}</span><span className="category-arrow">↗</span></div><div className="category-meta"><div><span>{category.kicker}</span><h3>{category.label}</h3></div><span className="category-count">Explore ↗</span></div></Link>; })}</div></section>
    <section className="pairing-section" id="tailoring-code"><div className="section pairing-inner"><div className="pairing-intro reveal"><p className="eyebrow">THE PAIRING PROTOCOL</p><h2>One wardrobe.<br/><em>More ways to wear it.</em></h2><p>Select an occasion. We’ll put together a considered shirt-and-trouser pairing, with $20 off the complete look.</p><div className="pairing-tabs" role="tablist" aria-label="Choose an occasion">{(["boardroom","smart","friday"] as const).map((key) => <button key={key} className={"pairing-tab" + (occasion === key ? " active" : "")} onClick={() => setOccasion(key)} role="tab" aria-selected={occasion === key}>{key === "smart" ? "Smart casual" : key === "friday" ? "Friday formal" : "Boardroom"}</button>)}</div><ul className="pairing-points"><li><span>✓</span>Balanced proportions, without the fuss</li><li><span>✓</span>Fabrics that bridge office and after-hours</li><li><span>✓</span>Save $20 on the complete look</li></ul></div><div className="pairing-showcase reveal reveal-delay-1"><div className="pairing-photo"><img src={pairing.shirt.image} alt={pairing.shirt.name}/><span>01 / The shirt</span></div><div className="pairing-photo"><img src={pairing.trouser.image} alt={pairing.trouser.name}/><span>02 / The trouser</span></div><div className="pairing-summary"><p className="eyebrow">COMPLETE THE LOOK</p><h3>{pairing.title}</h3><p>{pairing.desc}</p><div className="combo-prices"><span>Shirt <b>{money(pairing.shirt.price)}</b></span><span>Trousers <b>{money(pairing.trouser.price)}</b></span><span className="saving">Bundle saving <b>−$20</b></span></div><div className="combo-total"><span>Complete look</span><strong>{money(pairing.total)}</strong></div><button className="button button-dark button-full" onClick={() => { cart.add(pairing.shirt.id); cart.add(pairing.trouser.id); }}>Add complete look to bag ↗</button></div></div></div></section>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">THE EVERYDAY EDIT</p><h2>Pieces you’ll reach for.</h2></div><p>A small, versatile rotation beats a crowded wardrobe. Start with the essentials.</p></div><div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>
    <section className="section"><div className="atelier-card reveal"><div className="atelier-copy"><p className="eyebrow">THE FITTING ROOM, REIMAGINED</p><h2>Good clothes should<br/><em>feel like your own.</em></h2><p>Find your fit with straightforward sizing advice and complimentary fit guidance. Thoughtful details, minus the ceremony.</p><Link className="text-link" href="/collections/formal-shirts">Find your fit →</Link></div><div className="atelier-image"><img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=85" alt="Minimal menswear tailoring studio" loading="lazy"/></div></div></section>
  </main><Footer/></>;
}
export function CollectionView({ slug }: { slug: string }) {
  useReveal();
  const [filter, setFilter] = useState<"all" | "neutral" | "blue">("all");
  const [sort, setSort] = useState("featured");
  const valid = isCategory(slug);
  const collection = valid ? collections[slug] : null;
  const items = useMemo(() => {
    if (!valid) return [];
    let result = products.filter((product) => product.category === slug);
    if (filter === "neutral") result = result.filter((p) => /white|stone|khaki|natural/i.test(p.color));
    if (filter === "blue") result = result.filter((p) => /blue|navy|charcoal/i.test(p.color));
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [slug, filter, sort, valid]);
  if (!collection) return <><Header/><main className="section"><h1>Collection not found</h1><Link href="/">Return to the wardrobe</Link></main><Footer/></>;
  return <><Header/><main><section className="collection-hero"><div className="collection-hero-copy reveal"><p className="eyebrow">{collection.eyebrow}</p><h1>{collection.title}<br/><em>Made for every day.</em></h1><p>{collection.description}</p><Link className="text-link" href="#product-collection">Explore the collection ↓</Link></div><div className="collection-hero-image reveal reveal-delay-1"><img src={collection.image} alt={collection.title}/><span className="image-caption">THE FORMEL STUDY</span></div></section><section className="section catalog-section" id="product-collection"><div className="catalog-head"><div><p className="eyebrow">THE COLLECTION ROOM</p><h2>{collection.title} <em>({items.length})</em></h2></div><div className="catalog-controls"><div className="filter-chips"><button className={"filter-chip" + (filter === "all" ? " active" : "")} onClick={() => setFilter("all")}>All pieces</button><button className={"filter-chip" + (filter === "neutral" ? " active" : "")} onClick={() => setFilter("neutral")}>Neutrals</button><button className={"filter-chip" + (filter === "blue" ? " active" : "")} onClick={() => setFilter("blue")}>Blues & dark tones</button></div><label className="sort-label">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div></div><div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section><section className="editorial-band"><div className="section editorial-band-inner"><p className="eyebrow">THE DETAILS ARE THE DIFFERENCE</p><h2>Good form.<br/><em>Better every day.</em></h2><p>From the first button to the final cuff, each detail is chosen to make getting dressed feel effortless.</p><Link className="button button-light" href="/">Discover the full edit ↗</Link></div></section></main><Footer/></>;
}
