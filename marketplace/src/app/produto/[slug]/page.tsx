import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { addToCart, requestQuote, addReview } from "@/app/actions";
import { Flash, ListingCard, Stars, Verified, Visual, type SP } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { TYPES, money, parseSpecs, price, date, type ListingType } from "@/lib/format";

export default async function Produto({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const l = await db.listing.findUnique({
    where: { slug },
    include: { category: true, store: true, reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } } }
  });
  const user = await currentUser();
  const isOwner = !!user?.store && user.store.id === l?.storeId;
  if (!l || ((l.status !== "ACTIVE" || l.store.status !== "APPROVED") && !isOwner && user?.role !== "ADMIN")) notFound();

  const avg = l.reviews.length ? l.reviews.reduce((s, r) => s + r.rating, 0) / l.reviews.length : 0;
  const specs = parseSpecs(l.specs);
  const quote = l.requiresQuote || l.priceCents == null;
  const physical = l.type === "PHYSICAL";
  const related = await db.listing.findMany({ where: { categoryId: l.categoryId, id: { not: l.id }, status: "ACTIVE", store: { status: "APPROVED" } }, include: { category: true, store: true, reviews: { select: { rating: true } } }, take: 4 });
  const canReview = user ? !!(await db.orderItem.findFirst({ where: { listingId: l.id, order: { buyerId: user.id, status: { in: ["PAID", "SHIPPED", "COMPLETED"] } } } })) : false;

  return (
    <div className="wrap section">
      <nav className="crumbs" aria-label="Navegação"><Link href="/explorar">Explorar</Link>/<Link href={`/explorar?tipo=${l.type}`}>{TYPES[l.type as ListingType].label}</Link>/<Link href={`/explorar?categoria=${l.category.slug}`}>{l.category.name}</Link></nav>
      {l.status !== "ACTIVE" && <p className="alert alert--info" style={{ marginBottom: 20 }}>Pré-visualização: este anúncio ainda não está público.</p>}
      <div className="product">
        <div className="stack" style={{ gap: 28 }}>
          <Visual icon={l.category.icon} tag={TYPES[l.type as ListingType].singular.toUpperCase()} large />
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Descrição</h2>
            <p className="prose">{l.description}</p>
          </div>
          {specs.length > 0 && <div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Especificações</h2>
            <table className="specs"><tbody>{specs.map(([k, v], i) => <tr key={i}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
          </div>}
          <div id="avaliacoes">
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>Avaliações</h2>
            {l.reviews.length ? <Stars value={avg} count={l.reviews.length} /> : <p className="muted">Ainda sem avaliações.</p>}
            {l.reviews.map(r => <div key={r.id} className="review"><div className="row between"><b>{r.user.name}</b><span className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span></div><p className="dim" style={{ margin: "6px 0 0" }}>{r.comment}</p><small className="muted">{date(r.createdAt)}</small></div>)}
            {canReview && <form action={addReview} className="form card" style={{ marginTop: 18 }}>
              <input type="hidden" name="slug" value={l.slug} />
              <b>Avaliar sua compra</b>
              <div className="choice">{[5, 4, 3, 2, 1].map(n => <label key={n}><input type="radio" name="rating" value={n} defaultChecked={n === 5} /><span>{"★".repeat(n)}</span></label>)}</div>
              <label className="field"><span>Comentário</span><textarea id="review-comment" name="comment" rows={3} required /></label>
              <button className="btn btn--ghost" type="submit">Publicar avaliação</button>
            </form>}
          </div>
        </div>

        <div className="stack">
          <span className="eyebrow">{l.category.name}</span>
          <h1 className="page-title" style={{ fontSize: "clamp(26px,3vw,36px)" }}>{l.title}</h1>
          <p className="dim" style={{ fontSize: 17 }}>{l.summary}</p>
          <Flash sp={sp} />

          <div className="buybox">
            {quote ? (
              <>
                <div className="big">{price(l)}</div>
                <p className="dim" style={{ margin: 0 }}>Este {physical ? "item" : "serviço"} é dimensionado conforme o seu cenário. Descreva o que precisa e o vendedor responde com uma proposta.</p>
                {user ? (
                  <form action={requestQuote} className="form">
                    <input type="hidden" name="slug" value={l.slug} />
                    <label className="field"><span>Empresa (opcional)</span><input id="quote-company" name="company" autoComplete="organization" /></label>
                    <label className="field"><span>O que você precisa?</span><textarea id="quote-message" name="message" rows={4} placeholder="Escopo, prazos, local, quantidade de pessoas ou ativos…" required /></label>
                    <button className="btn btn--primary btn--block" type="submit">Solicitar orçamento</button>
                  </form>
                ) : <Link className="btn btn--primary btn--block" href={`/entrar?next=/produto/${l.slug}`}>Entrar para solicitar orçamento</Link>}
              </>
            ) : (
              <>
                <div className="big">{money(l.priceCents!)}{l.priceUnit !== "un" && <small> / {l.priceUnit}</small>}</div>
                {physical && <span className={`pill ${l.stock ? "pill--ok" : "pill--bad"}`}>{l.stock ? `${l.stock} em estoque` : "Sem estoque"}</span>}
                <form action={addToCart} className="row">
                  <input type="hidden" name="id" value={l.id} />
                  <label className="sr" htmlFor="qty">Quantidade</label>
                  <input id="qty" className="input qty" type="number" name="q" min={1} max={physical ? Math.max(1, l.stock ?? 1) : 99} defaultValue={1} />
                  <button className="btn btn--primary" style={{ flex: 1 }} type="submit" disabled={physical && !l.stock}><Icon name="cart" size={16} /> Adicionar ao carrinho</button>
                </form>
              </>
            )}
            <p className="mono muted" style={{ margin: 0 }}>🔒 Pagamento protegido · repasse ao vendedor após confirmação</p>
          </div>

          <Link href={`/loja/${l.store.slug}`} className="sellerbox">
            <span className="avatar">{l.store.name[0]}</span>
            <span style={{ flex: 1 }}><b>{l.store.name}</b> {l.store.verified && <Verified />}<br /><small className="muted">{l.store.kind === "PROFISSIONAL" ? "Profissional independente" : "Empresa"} · {l.store.city}</small></span>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </div>

      {related.length > 0 && <div style={{ marginTop: 64 }}>
        <div className="head"><h2>Na mesma categoria</h2></div>
        <div className="grid">{related.map(r => <ListingCard key={r.id} l={r} />)}</div>
      </div>}
    </div>
  );
}
