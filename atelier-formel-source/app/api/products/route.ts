import { NextResponse } from "next/server";
import { isCategory, products } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  let items = products;
  if (category && isCategory(category)) items = items.filter((product) => product.category === category);
  if (query) items = items.filter((product) => [product.name, product.description, product.color, product.category].join(" ").toLowerCase().includes(query));
  return NextResponse.json({ items, count: items.length, currency: "USD" }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { items?: unknown[] };
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 30) {
      return NextResponse.json({ error: "Expected 1–30 order item lines." }, { status: 400 });
    }
    const lines = body.items.map((raw) => {
      if (!raw || typeof raw !== "object") throw new Error("Invalid line item.");
      const input = raw as { id?: unknown; quantity?: unknown };
      const product = products.find((item) => item.id === input.id);
      const quantity = Number(input.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("Invalid product or quantity.");
      return { id: product.id, name: product.name, unitPrice: product.price, quantity, lineTotal: product.price * quantity };
    });
    return NextResponse.json({
      orderId: "AF-DEMO-" + Date.now().toString(36).toUpperCase(),
      status: "demo-only",
      currency: "USD",
      items: lines,
      subtotal: lines.reduce((sum, line) => sum + line.lineTotal, 0),
      message: "Demo order created. No payment collected."
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid order request." }, { status: 400 });
  }
}