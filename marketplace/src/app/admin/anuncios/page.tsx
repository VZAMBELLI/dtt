import Link from "next/link";
import { db } from "@/lib/db";
import { adminListing } from "@/app/actions";
import { StatusPill } from "@/components/ui";
import { LISTING_STATUS, price, parseSpecs } from "@/lib/format";

export const metadata = { title: "Curadoria" };

export default async function Curadoria() {
  const [pending, active] = await Promise.all([
    db.listing.findMany({ where: { status: "PENDING" }, include: { store: true, category: true }, orderBy: { createdAt: "asc" } }),
    db.listing.findMany({ where: { status: "ACTIVE" }, include: { store: true, category: true }, orderBy: { createdAt: "desc" } })
  ]);
  return (
    <>
      <h1 className="page-title">Curadoria de anúncios</h1>
      <p className="dim">Recuse itens da lista de proibidos (jammers, interceptação, spyware, armas, produtos sem homologação).</p>
      <h2 style={{ fontSize: 20, margin: "24px 0 12px" }}>Na fila ({pending.length})</h2>
      {pending.length ? <div className="stack">{pending.map(l => (
        <div key={l.id} className="card stack" style={{ gap: 8 }}>
          <div className="row between"><Link className="link" href={`/produto/${l.slug}`}><b>{l.title}</b></Link><span className="muted">{l.store.name} · {l.category.name} · {price(l)}</span></div>
          <p className="dim" style={{ margin: 0 }}>{l.summary}</p>
          {parseSpecs(l.specs).length > 0 && <small className="muted">{parseSpecs(l.specs).map(([k, v]) => `${k}: ${v}`).join(" · ")}</small>}
          <div className="row">
            <form action={adminListing}><input type="hidden" name="id" value={l.id} /><input type="hidden" name="action" value="approve" /><button className="btn btn--primary btn--sm" type="submit">Aprovar</button></form>
            <form action={adminListing} className="row" style={{ flex: 1, flexWrap: "nowrap" }}><input type="hidden" name="id" value={l.id} /><input type="hidden" name="action" value="reject" /><input className="input" name="reason" placeholder="Motivo da recusa" aria-label="Motivo da recusa" style={{ padding: "6px 10px" }} /><button className="btn btn--danger btn--sm" type="submit">Recusar</button></form>
          </div>
        </div>))}</div> : <p className="muted">Nenhum anúncio aguardando.</p>}

      <h2 style={{ fontSize: 20, margin: "36px 0 12px" }}>Publicados ({active.length})</h2>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Anúncio</th><th>Vendedor</th><th>Status</th><th>Destaque</th><th></th></tr></thead>
        <tbody>{active.map(l => <tr key={l.id}>
          <td><Link className="link" href={`/produto/${l.slug}`}>{l.title}</Link></td><td>{l.store.name}</td>
          <td><StatusPill status={l.status} map={LISTING_STATUS} /></td><td>{l.featured ? "★" : "—"}</td>
          <td><div className="row" style={{ flexWrap: "nowrap" }}>
            <form action={adminListing}><input type="hidden" name="id" value={l.id} /><input type="hidden" name="action" value={l.featured ? "unfeature" : "feature"} /><button className="btn btn--ghost btn--sm" type="submit">{l.featured ? "Tirar destaque" : "Destacar"}</button></form>
            <form action={adminListing}><input type="hidden" name="id" value={l.id} /><input type="hidden" name="action" value="reject" /><button className="btn btn--danger btn--sm" type="submit">Remover</button></form>
          </div></td></tr>)}</tbody>
      </table></div>
    </>
  );
}
