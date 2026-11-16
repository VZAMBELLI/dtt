import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ListingCard, Verified } from "@/components/ui";
import { date } from "@/lib/format";

export default async function Loja({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await db.store.findUnique({ where: { slug }, include: { listings: { where: { status: "ACTIVE" }, include: { category: true, store: true, reviews: { select: { rating: true } } }, orderBy: { createdAt: "desc" } } } });
  if (!s || s.status !== "APPROVED") notFound();
  return (
    <div className="wrap section">
      <div className="row" style={{ gap: 20, alignItems: "flex-start", marginBottom: 40 }}>
        <span className="avatar avatar--lg">{s.name[0]}</span>
        <div style={{ flex: 1, minWidth: 260 }}>
          <span className="eyebrow">{s.kind === "PROFISSIONAL" ? "Profissional independente" : "Loja"}</span>
          <h1 className="page-title">{s.name} {s.verified && <Verified />}</h1>
          <p className="dim" style={{ maxWidth: 680 }}>{s.bio}</p>
          <div className="row">
            {s.verified && <span className="pill pill--ok">Vendedor verificado</span>}
            {s.credentials && <span className="pill">{s.credentials}</span>}
            <span className="pill">{s.city}</span>
            <span className="pill">Desde {date(s.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="head"><h2>{s.listings.length} {s.listings.length === 1 ? "oferta" : "ofertas"}</h2></div>
      <div className="grid">{s.listings.map(l => <ListingCard key={l.id} l={l} />)}</div>
    </div>
  );
}
