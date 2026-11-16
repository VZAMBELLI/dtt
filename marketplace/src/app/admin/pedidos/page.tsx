import { db } from "@/lib/db";
import { StatusPill } from "@/components/ui";
import { ORDER_STATUS, money, date } from "@/lib/format";

export const metadata = { title: "Pedidos" };

export default async function Pedidos() {
  const orders = await db.order.findMany({ include: { buyer: { select: { name: true } }, items: { include: { store: { select: { name: true } } } } }, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <>
      <h1 className="page-title">Pedidos</h1>
      {orders.length ? <div className="table-wrap" style={{ marginTop: 16 }}><table className="table">
        <thead><tr><th>Pedido</th><th>Cliente</th><th>Vendedores</th><th>Status</th><th className="num">Total</th><th className="num">Comissão</th></tr></thead>
        <tbody>{orders.map(o => <tr key={o.id}>
          <td><span className="mono">{o.code}</span><br /><small className="muted">{date(o.createdAt)}</small></td>
          <td>{o.buyer.name}</td><td>{[...new Set(o.items.map(i => i.store.name))].join(", ")}</td>
          <td><StatusPill status={o.status} map={ORDER_STATUS} /></td>
          <td className="num">{money(o.totalCents)}</td><td className="num">{money(o.feeCents)}</td>
        </tr>)}</tbody>
      </table></div> : <p className="muted" style={{ marginTop: 16 }}>Nenhum pedido ainda.</p>}
    </>
  );
}
