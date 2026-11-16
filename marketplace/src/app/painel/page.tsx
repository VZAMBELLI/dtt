import Link from "next/link";
import { db } from "@/lib/db";
import { requireSeller } from "@/lib/auth";
import { one, type SP } from "@/components/ui";
import { money, date } from "@/lib/format";

export const metadata = { title: "Painel do vendedor" };

export default async function Painel({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { store } = await requireSeller();
  const paid = { storeId: store.id, order: { status: { in: ["PAID", "SHIPPED", "COMPLETED"] } } };
  const [agg, toShip, openQuotes, active, recent] = await Promise.all([
    db.orderItem.aggregate({ where: paid, _sum: { sellerNetCents: true, commissionCents: true }, _count: true }),
    db.orderItem.count({ where: { storeId: store.id, fulfillment: "PENDING", order: { status: "PAID" } } }),
    db.quoteRequest.count({ where: { storeId: store.id, status: "OPEN" } }),
    db.listing.count({ where: { storeId: store.id, status: "ACTIVE" } }),
    db.orderItem.findMany({ where: paid, include: { order: true }, orderBy: { order: { createdAt: "desc" } }, take: 5 })
  ]);
  return (
    <>
      <span className="eyebrow">Painel do vendedor</span>
      <h1 className="page-title">{store.name}</h1>
      {one(sp.novo) && <div className="alert alert--ok row between"><span>Loja enviada para verificação. Etapa 3: cadastre seus produtos e serviços. Eles ficam públicos após a aprovação.</span><Link className="btn btn--primary btn--sm" href="/painel/anuncios/novo">Cadastrar primeiro anúncio</Link></div>}
      {store.status === "PENDING" && !one(sp.novo) && <p className="alert alert--info">Sua loja está em análise. Os anúncios ficam visíveis assim que ela for aprovada.</p>}
      {store.status === "REJECTED" && <p className="alert alert--bad">Sua loja não foi aprovada. Fale com a equipe de curadoria.</p>}
      <div className="kpis" style={{ marginTop: 20 }}>
        <div className="kpi"><span>A receber (líquido)</span><b>{money(agg._sum.sellerNetCents ?? 0)}</b></div>
        <div className="kpi"><span>Itens vendidos</span><b>{agg._count}</b></div>
        <div className="kpi"><span>Para enviar</span><b>{toShip}</b></div>
        <div className="kpi"><span>Orçamentos abertos</span><b>{openQuotes}</b></div>
      </div>
      <div className="row" style={{ marginBottom: 28 }}>
        <Link className="btn btn--primary" href="/painel/anuncios/novo">Novo anúncio</Link>
        <Link className="btn btn--ghost" href="/painel/anuncios">{active} anúncios publicados</Link>
        <span className="muted" style={{ fontSize: 13 }}>Comissão da plataforma: {(store.commissionRate * 100).toFixed(1).replace(".0", "")}%</span>
      </div>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>Vendas recentes</h2>
      {recent.length ? <div className="table-wrap"><table className="table">
        <thead><tr><th>Pedido</th><th>Item</th><th>Data</th><th className="num">Líquido</th></tr></thead>
        <tbody>{recent.map(i => <tr key={i.id}><td className="mono">{i.order.code}</td><td>{i.quantity}× {i.title}</td><td>{date(i.order.createdAt)}</td><td className="num">{money(i.sellerNetCents)}</td></tr>)}</tbody>
      </table></div> : <p className="muted">Nenhuma venda ainda.</p>}
    </>
  );
}
