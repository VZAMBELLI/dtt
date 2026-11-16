import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { ListingCard, one, type SP } from "@/components/ui";
import { TYPES, TYPE_KEYS, type ListingType } from "@/lib/format";

export const metadata = { title: "Explorar" };

export default async function Explorar({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = one(sp.q)?.trim().slice(0, 80) ?? "";
  const tipo = TYPE_KEYS.includes(one(sp.tipo) as ListingType) ? (one(sp.tipo) as ListingType) : undefined;
  const cat = one(sp.categoria);
  const ordem = one(sp.ordem) ?? "recentes";

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE", store: { status: "APPROVED" },
    ...(tipo && { type: tipo }),
    ...(cat && { category: { slug: cat } }),
    ...(ordem === "destaques" && { featured: true }),
    ...(q && { OR: [{ title: { contains: q } }, { summary: { contains: q } }, { category: { name: { contains: q } } }, { store: { name: { contains: q } } }] })
  };
  const orderBy: Prisma.ListingOrderByWithRelationInput =
    ordem === "menor" ? { priceCents: "asc" } : ordem === "maior" ? { priceCents: "desc" } : { createdAt: "desc" };

  const [items, cats] = await Promise.all([
    db.listing.findMany({ where, orderBy, include: { category: true, store: true, reviews: { select: { rating: true } } }, take: 60 }),
    db.category.findMany({ where: tipo ? { type: tipo } : {}, orderBy: { name: "asc" }, include: { _count: { select: { listings: { where: { status: "ACTIVE" } } } } } })
  ]);

  const url = (p: Record<string, string | undefined>) => {
    const s = new URLSearchParams();
    const all = { q: q || undefined, tipo, categoria: cat, ordem: ordem === "recentes" ? undefined : ordem, ...p };
    Object.entries(all).forEach(([k, v]) => v && s.set(k, v));
    return `/explorar${s.size ? "?" + s : ""}`;
  };

  return (
    <div className="wrap section">
      <span className="eyebrow">{tipo ? TYPES[tipo].label : "Catálogo"}</span>
      <h1 className="page-title">{q ? `Resultados para “${q}”` : tipo ? TYPES[tipo].desc : "Explorar o marketplace"}</h1>
      <p className="dim" style={{ marginBottom: 28 }}>{items.length} {items.length === 1 ? "oferta encontrada" : "ofertas encontradas"}</p>

      <div className="catalog">
        <aside className="filters" aria-label="Filtros">
          <div>
            <h4>Tipo</h4>
            <nav>
              <Link href={url({ tipo: undefined, categoria: undefined })} className={!tipo ? "on" : ""}>Tudo</Link>
              {TYPE_KEYS.map(t => <Link key={t} href={url({ tipo: t, categoria: undefined })} className={tipo === t ? "on" : ""}>{TYPES[t].label}</Link>)}
            </nav>
          </div>
          <div>
            <h4>Categoria</h4>
            <nav>
              {cats.map(c => <Link key={c.id} href={url({ categoria: cat === c.slug ? undefined : c.slug })} className={cat === c.slug ? "on" : ""}>{c.name}<span className="muted">{c._count.listings}</span></Link>)}
            </nav>
          </div>
        </aside>

        <div>
          <div className="toolbar">
            <div className="sort" aria-label="Ordenar">
              {[["recentes", "Mais recentes"], ["destaques", "Destaques"], ["menor", "Menor preço"], ["maior", "Maior preço"]].map(([k, l]) =>
                <Link key={k} href={url({ ordem: k === "recentes" ? undefined : k })} className={ordem === k ? "on" : ""}>{l}</Link>)}
            </div>
          </div>
          {items.length
            ? <div className="grid">{items.map(l => <ListingCard key={l.id} l={l} />)}</div>
            : <div className="empty"><h3>Nada encontrado</h3><p>Tente outro termo ou remova filtros.</p><Link className="btn btn--ghost" href="/explorar">Limpar filtros</Link></div>}
        </div>
      </div>
    </div>
  );
}
