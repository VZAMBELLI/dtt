import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE = "sp_cart";
export type CartLine = { id: string; q: number };

export async function readCart(): Promise<CartLine[]> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v)
      ? v.filter(l => typeof l?.id === "string" && Number.isInteger(l?.q) && l.q > 0 && l.q <= 99).slice(0, 50)
      : [];
  } catch { return []; }
}

export async function writeCart(lines: CartLine[]) {
  (await cookies()).set(COOKIE, JSON.stringify(lines), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

/** Carrinho com preços sempre vindos do banco (nunca do navegador). */
export async function cartDetails() {
  const lines = await readCart();
  if (!lines.length) return { items: [], totalCents: 0, count: 0 };
  const listings = await db.listing.findMany({
    where: { id: { in: lines.map(l => l.id) }, status: "ACTIVE", requiresQuote: false, priceCents: { not: null }, store: { status: "APPROVED" } },
    include: { store: true, category: true }
  });
  const items = lines.flatMap(l => {
    const listing = listings.find(x => x.id === l.id);
    if (!listing) return [];
    const max = listing.stock ?? 99;
    const q = Math.min(l.q, Math.max(max, 0));
    return q > 0 ? [{ listing, q, subtotal: q * (listing.priceCents as number) }] : [];
  });
  return { items, totalCents: items.reduce((s, i) => s + i.subtotal, 0), count: items.reduce((s, i) => s + i.q, 0) };
}
