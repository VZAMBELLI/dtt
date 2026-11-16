"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, requireUser, requireSeller, requireAdmin } from "@/lib/auth";
import { readCart, writeCart, cartDetails } from "@/lib/cart";
import { paymentProvider, isSimulated } from "@/lib/payments";
import { slugify, TYPE_KEYS } from "@/lib/format";
import { randomBytes } from "crypto";

const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);
const back = (path: string, msg: string, key = "erro") => redirect(`${path}${path.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(msg)}`);
const safeNext = (n: string) => (n.startsWith("/") && !n.startsWith("//") ? n : "/");

/* ---------------- Conta ---------------- */
export async function signup(f: FormData) {
  const name = str(f, "name", 80), email = str(f, "email", 120).toLowerCase(), password = String(f.get("password") ?? "");
  const next = safeNext(str(f, "next"));
  if (name.length < 2) back("/cadastrar", "Informe seu nome.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) back("/cadastrar", "E-mail inválido.");
  if (password.length < 8) back("/cadastrar", "A senha precisa ter pelo menos 8 caracteres.");
  if (await db.user.findUnique({ where: { email } })) back("/cadastrar", "Já existe uma conta com este e-mail.");
  const user = await db.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  await createSession(user.id);
  redirect(next);
}

export async function login(f: FormData) {
  const email = str(f, "email", 120).toLowerCase(), password = String(f.get("password") ?? "");
  const next = safeNext(str(f, "next"));
  const user = await db.user.findUnique({ where: { email } });
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva");
  if (!user || !ok) back(`/entrar?next=${encodeURIComponent(next)}`, "E-mail ou senha incorretos.");
  await createSession(user!.id);
  redirect(next);
}

export async function logout() {
  await destroySession();
  redirect("/");
}

/* ---------------- Carrinho ---------------- */
export async function addToCart(f: FormData) {
  const id = str(f, "id", 40);
  const q = Math.max(1, Math.min(99, parseInt(str(f, "q", 3)) || 1));
  const listing = await db.listing.findFirst({ where: { id, status: "ACTIVE", requiresQuote: false, priceCents: { not: null } } });
  if (!listing) redirect("/carrinho");
  const lines = await readCart();
  const cur = lines.find(l => l.id === id);
  if (cur) cur.q = Math.min(99, cur.q + q); else lines.push({ id, q });
  await writeCart(lines);
  redirect("/carrinho?ok=1");
}

export async function setCartQty(f: FormData) {
  const id = str(f, "id", 40);
  const q = parseInt(str(f, "q", 3)) || 0;
  const lines = (await readCart()).map(l => (l.id === id ? { ...l, q: Math.min(99, q) } : l)).filter(l => l.q > 0);
  await writeCart(lines);
  revalidatePath("/carrinho");
}

/* ---------------- Checkout ---------------- */
export async function checkout(f: FormData) {
  const user = await requireUser("/checkout");
  const method = str(f, "method", 10) as "PIX" | "CARTAO" | "BOLETO";
  const shipName = str(f, "shipName", 120), shipAddress = str(f, "shipAddress", 400);
  if (!["PIX", "CARTAO", "BOLETO"].includes(method)) back("/checkout", "Escolha a forma de pagamento.");
  const { items, totalCents } = await cartDetails();
  if (!items.length) redirect("/carrinho");
  const needsShipping = items.some(i => i.listing.type === "PHYSICAL");
  if (needsShipping && (shipName.length < 3 || shipAddress.length < 10)) back("/checkout", "Informe nome e endereço completo para entrega.");

  const code = "SP" + Date.now().toString(36).toUpperCase().slice(-5) + randomBytes(2).toString("hex").toUpperCase();
  const rows = items.map(i => {
    const sub = i.subtotal;
    const commission = Math.round(sub * i.listing.store.commissionRate);
    return { listingId: i.listing.id, storeId: i.listing.storeId, title: i.listing.title, quantity: i.q, unitPriceCents: i.listing.priceCents as number, commissionCents: commission, sellerNetCents: sub - commission, physical: i.listing.type === "PHYSICAL" };
  });
  const feeCents = rows.reduce((s, r) => s + r.commissionCents, 0);

  const order = await db.$transaction(async tx => {
    for (const r of rows.filter(r => r.physical)) {
      const res = await tx.listing.updateMany({ where: { id: r.listingId, stock: { gte: r.quantity } }, data: { stock: { decrement: r.quantity } } });
      if (res.count === 0) throw new Error("ESTOQUE");
    }
    return tx.order.create({
      data: {
        code, buyerId: user.id, totalCents, feeCents, paymentMethod: method,
        shipName: shipName || user.name, shipAddress: needsShipping ? shipAddress : "Entrega digital / serviço",
        items: { create: rows.map(({ physical, ...r }) => r) }
      }
    });
  }).catch(e => { if (e instanceof Error && e.message === "ESTOQUE") back("/carrinho", "Um item ficou sem estoque. Revise o carrinho."); throw e; });

  const splits = Object.values(rows.reduce<Record<string, { storeId: string; amountCents: number }>>((acc, r) => {
    (acc[r.storeId] ??= { storeId: r.storeId, amountCents: 0 }).amountCents += r.sellerNetCents; return acc;
  }, {}));
  const charge = await paymentProvider().createCharge({ orderCode: code, totalCents, platformFeeCents: feeCents, splits, method });
  await db.order.update({ where: { id: order.id }, data: { paymentRef: charge.ref } });
  await writeCart([]);
  redirect(`/pedidos/${order.code}`);
}

export async function confirmSimulatedPayment(f: FormData) {
  const user = await requireUser();
  if (!isSimulated()) redirect("/conta");
  const code = str(f, "code", 30);
  await db.order.updateMany({ where: { code, buyerId: user.id, status: "PENDING_PAYMENT" }, data: { status: "PAID", paidAt: new Date() } });
  redirect(`/pedidos/${code}?pago=1`);
}

/* ---------------- Orçamentos ---------------- */
export async function requestQuote(f: FormData) {
  const slug = str(f, "slug", 80);
  const user = await requireUser(`/produto/${slug}`);
  const listing = await db.listing.findFirst({ where: { slug, status: "ACTIVE" } });
  if (!listing) redirect("/explorar");
  const message = str(f, "message", 3000);
  if (message.length < 15) back(`/produto/${slug}`, "Descreva sua necessidade em pelo menos 15 caracteres.");
  await db.quoteRequest.create({ data: { listingId: listing.id, storeId: listing.storeId, buyerId: user.id, company: str(f, "company", 120), message } });
  redirect(`/conta?orcamento=1`);
}

export async function replyQuote(f: FormData) {
  const { store } = await requireSeller();
  const id = str(f, "id", 40), reply = str(f, "reply", 3000);
  if (reply.length < 5) back("/painel/orcamentos", "Escreva uma resposta.");
  await db.quoteRequest.updateMany({ where: { id, storeId: store.id }, data: { reply, status: "ANSWERED" } });
  revalidatePath("/painel/orcamentos");
}

/* ---------------- Avaliações ---------------- */
export async function addReview(f: FormData) {
  const user = await requireUser();
  const slug = str(f, "slug", 80);
  const rating = Math.max(1, Math.min(5, parseInt(str(f, "rating", 1)) || 0));
  const comment = str(f, "comment", 1000);
  const listing = await db.listing.findUnique({ where: { slug } });
  if (!listing) redirect("/");
  const bought = await db.orderItem.findFirst({ where: { listingId: listing.id, order: { buyerId: user.id, status: { in: ["PAID", "SHIPPED", "COMPLETED"] } } } });
  if (!bought) back(`/produto/${slug}`, "Só quem comprou pode avaliar.");
  if (comment.length < 5) back(`/produto/${slug}`, "Escreva um comentário.");
  await db.review.upsert({ where: { listingId_userId: { listingId: listing.id, userId: user.id } }, create: { listingId: listing.id, userId: user.id, rating, comment }, update: { rating, comment } });
  redirect(`/produto/${slug}#avaliacoes`);
}

/* ---------------- Vendedor ---------------- */
export async function applySeller(f: FormData) {
  const user = await requireUser("/vender");
  if (user.store) redirect("/painel");
  const name = str(f, "name", 80), kind = str(f, "kind", 20), document = str(f, "document", 30);
  const city = str(f, "city", 80), bio = str(f, "bio", 1500), credentials = str(f, "credentials", 500);
  if (name.length < 2) back("/vender", "Informe o nome da loja.");
  if (!["EMPRESA", "PROFISSIONAL"].includes(kind)) back("/vender", "Escolha o tipo de vendedor.");
  const digits = document.replace(/\D/g, "");
  if (!(digits.length === 11 || digits.length === 14)) back("/vender", "Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).");
  if (bio.length < 30) back("/vender", "Descreva sua atuação em pelo menos 30 caracteres.");
  if (f.get("terms") !== "on") back("/vender", "É preciso aceitar as regras de curadoria.");
  let slug = slugify(name) || "loja";
  if (await db.store.findUnique({ where: { slug } })) slug += "-" + randomBytes(2).toString("hex");
  await db.store.create({ data: { userId: user.id, name, slug, kind, document, city, bio, credentials } });
  redirect("/painel?novo=1");
}

export async function saveListing(f: FormData) {
  const { store } = await requireSeller();
  const id = str(f, "id", 40);
  const title = str(f, "title", 120), summary = str(f, "summary", 200), description = str(f, "description", 6000);
  const categoryId = str(f, "categoryId", 40);
  const priceRaw = str(f, "price", 20).replace(/\./g, "").replace(",", ".");
  const requiresQuote = f.get("requiresQuote") === "on";
  const priceCents = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : null;
  const priceUnit = str(f, "priceUnit", 20) || "un";
  const stockRaw = str(f, "stock", 6);
  const specs = str(f, "specs", 3000).split("\n").map(l => l.split(":")).filter(p => p.length >= 2 && p[0].trim())
    .slice(0, 20).map(p => [p[0].trim().slice(0, 60), p.slice(1).join(":").trim().slice(0, 120)]);
  const form = id ? `/painel/anuncios/${id}` : "/painel/anuncios/novo";

  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (!category) back(form, "Escolha uma categoria.");
  if (title.length < 5) back(form, "O título precisa ter pelo menos 5 caracteres.");
  if (summary.length < 15) back(form, "O resumo precisa ter pelo menos 15 caracteres.");
  if (priceCents !== null && (!Number.isFinite(priceCents) || priceCents < 100 || priceCents > 100_000_000)) back(form, "Preço inválido.");
  if (!requiresQuote && priceCents === null) back(form, "Informe um preço ou marque “sob orçamento”.");
  const type = category!.type;
  if (!TYPE_KEYS.includes(type as never)) back(form, "Categoria inválida.");
  const stock = type === "PHYSICAL" ? Math.max(0, parseInt(stockRaw) || 0) : null;

  const data = { title, summary, description: description || summary, categoryId, type, priceCents, priceUnit, requiresQuote, stock, specs: JSON.stringify(specs), status: "PENDING", rejectReason: null };
  if (id) {
    const res = await db.listing.updateMany({ where: { id, storeId: store.id }, data });
    if (!res.count) redirect("/painel/anuncios");
  } else {
    let slug = slugify(title);
    if (await db.listing.findUnique({ where: { slug } })) slug += "-" + randomBytes(2).toString("hex");
    await db.listing.create({ data: { ...data, slug, storeId: store.id } });
  }
  redirect("/painel/anuncios?ok=1");
}

export async function toggleListing(f: FormData) {
  const { store } = await requireSeller();
  const id = str(f, "id", 40);
  const l = await db.listing.findFirst({ where: { id, storeId: store.id } });
  if (!l) return;
  const next = l.status === "DRAFT" ? "PENDING" : "DRAFT";
  if (l.status === "ACTIVE" || l.status === "DRAFT") await db.listing.update({ where: { id }, data: { status: next } });
  revalidatePath("/painel/anuncios");
}

export async function shipItem(f: FormData) {
  const { store } = await requireSeller();
  const id = str(f, "id", 40), trackingCode = str(f, "tracking", 60);
  const item = await db.orderItem.findFirst({ where: { id, storeId: store.id, order: { status: { in: ["PAID", "SHIPPED"] } } } });
  if (!item) return;
  await db.orderItem.update({ where: { id }, data: { fulfillment: "SHIPPED", trackingCode: trackingCode || null } });
  const pending = await db.orderItem.count({ where: { orderId: item.orderId, fulfillment: "PENDING" } });
  await db.order.update({ where: { id: item.orderId }, data: { status: pending ? "PAID" : "SHIPPED" } });
  revalidatePath("/painel/vendas");
}

export async function confirmReceived(f: FormData) {
  const user = await requireUser();
  const code = str(f, "code", 30);
  const order = await db.order.findFirst({ where: { code, buyerId: user.id, status: { in: ["PAID", "SHIPPED"] } } });
  if (order) {
    await db.orderItem.updateMany({ where: { orderId: order.id }, data: { fulfillment: "DELIVERED" } });
    await db.order.update({ where: { id: order.id }, data: { status: "COMPLETED" } });
  }
  redirect(`/pedidos/${code}`);
}

/* ---------------- Admin ---------------- */
export async function adminStore(f: FormData) {
  await requireAdmin();
  const id = str(f, "id", 40), action = str(f, "action", 20);
  const rate = parseFloat(str(f, "rate", 6).replace(",", "."));
  const map: Record<string, object> = {
    approve: { status: "APPROVED" }, reject: { status: "REJECTED" }, suspend: { status: "SUSPENDED" },
    verify: { verified: true }, unverify: { verified: false },
    rate: Number.isFinite(rate) && rate >= 0 && rate <= 50 ? { commissionRate: rate / 100 } : {}
  };
  if (map[action]) await db.store.update({ where: { id }, data: map[action] });
  revalidatePath("/admin");
}

export async function adminListing(f: FormData) {
  await requireAdmin();
  const id = str(f, "id", 40), action = str(f, "action", 20), reason = str(f, "reason", 300);
  if (action === "approve") await db.listing.update({ where: { id }, data: { status: "ACTIVE", rejectReason: null } });
  if (action === "reject") await db.listing.update({ where: { id }, data: { status: "REJECTED", rejectReason: reason || "Não atende às regras de curadoria." } });
  if (action === "feature") await db.listing.update({ where: { id }, data: { featured: true } });
  if (action === "unfeature") await db.listing.update({ where: { id }, data: { featured: false } });
  revalidatePath("/admin");
  revalidatePath("/admin/anuncios");
}

