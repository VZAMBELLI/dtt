import Link from "next/link";
import { db } from "@/lib/db";
import { requireSeller } from "@/lib/auth";
import { toggleListing } from "@/app/actions";
import { StatusPill, one, type SP } from "@/components/ui";
import { LISTING_STATUS, price } from "@/lib/format";

export const metadata = { title: "Meus anúncios" };

export default async function Anuncios({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { store } = await requireSeller();
  const items = await db.listing.findMany({ where: { storeId: store.id }, include: { category: true }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <div className="row between"><h1 className="page-title">Anúncios</h1><Link className="btn btn--primary" href="/painel/anuncios/novo">Novo anúncio</Link></div>
      {one(sp.ok) && <p className="alert alert--ok">Anúncio enviado para a curadoria.</p>}
      {items.length ? <div className="table-wrap" style={{ marginTop: 16 }}><table className="table">
        <thead><tr><th>Anúncio</th><th>Categoria</th><th>Preço</th><th className="num">Estoque</th><th>Status</th><th></th></tr></thead>
        <tbody>{items.map(l => <tr key={l.id}>
          <td><Link className="link" href={`/produto/${l.slug}`}>{l.title}</Link></td>
          <td>{l.category.name}</td><td>{price(l)}</td><td className="num">{l.stock ?? "—"}</td>
          <td><StatusPill status={l.status} map={LISTING_STATUS} /></td>
          <td><div className="row" style={{ flexWrap: "nowrap" }}>
            <Link className="btn btn--ghost btn--sm" href={`/painel/anuncios/${l.id}`}>Editar</Link>
            {(l.status === "ACTIVE" || l.status === "DRAFT") && <form action={toggleListing}><input type="hidden" name="id" value={l.id} /><button className="btn btn--sm" type="submit">{l.status === "ACTIVE" ? "Pausar" : "Reativar"}</button></form>}
          </div></td>
        </tr>)}</tbody>
      </table></div> : <div className="empty" style={{ marginTop: 16 }}><h3>Nenhum anúncio ainda</h3><Link className="btn btn--primary" href="/painel/anuncios/novo">Criar o primeiro</Link></div>}
    </>
  );
}
