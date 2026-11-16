import Link from "next/link";
import { db } from "@/lib/db";
import { money } from "@/lib/format";

export const metadata = { title: "Administração" };

export default async function Admin() {
  const paid = { status: { in: ["PAID", "SHIPPED", "COMPLETED"] } };
  const [gmv, stores, pendingStores, pendingListings, buyers] = await Promise.all([
    db.order.aggregate({ where: paid, _sum: { totalCents: true, feeCents: true }, _count: true }),
    db.store.count({ where: { status: "APPROVED" } }),
    db.store.count({ where: { status: "PENDING" } }),
    db.listing.count({ where: { status: "PENDING" } }),
    db.user.count()
  ]);
  return (
    <>
      <span className="eyebrow">Administração</span>
      <h1 className="page-title">Visão geral</h1>
      <div className="kpis" style={{ marginTop: 20 }}>
        <div className="kpi"><span>Vendas pagas (GMV)</span><b>{money(gmv._sum.totalCents ?? 0)}</b></div>
        <div className="kpi"><span>Receita de comissões</span><b>{money(gmv._sum.feeCents ?? 0)}</b></div>
        <div className="kpi"><span>Pedidos pagos</span><b>{gmv._count}</b></div>
        <div className="kpi"><span>Usuários</span><b>{buyers}</b></div>
      </div>
      <div className="types" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        <Link className="type" href="/admin/lojas"><h3>{pendingStores} vendedores aguardando</h3><p>{stores} lojas aprovadas</p></Link>
        <Link className="type" href="/admin/anuncios"><h3>{pendingListings} anúncios na fila</h3><p>Curadoria antes da publicação</p></Link>
      </div>
    </>
  );
}
