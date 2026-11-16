import { db } from "@/lib/db";
import { requireSeller } from "@/lib/auth";
import { shipItem } from "@/app/actions";
import { StatusPill } from "@/components/ui";
import { ORDER_STATUS, money, date } from "@/lib/format";

export const metadata = { title: "Vendas" };

export default async function Vendas() {
  const { store } = await requireSeller();
  const items = await db.orderItem.findMany({ where: { storeId: store.id }, include: { order: true, listing: true }, orderBy: { order: { createdAt: "desc" } } });
  return (
    <>
      <h1 className="page-title">Vendas</h1>
      <p className="dim">O valor líquido já desconta a comissão da plataforma.</p>
      {items.length ? <div className="table-wrap" style={{ marginTop: 16 }}><table className="table">
        <thead><tr><th>Pedido</th><th>Item</th><th>Entrega</th><th>Status</th><th className="num">Bruto</th><th className="num">Comissão</th><th className="num">Líquido</th><th>Envio</th></tr></thead>
        <tbody>{items.map(i => <tr key={i.id}>
          <td><span className="mono">{i.order.code}</span><br /><small className="muted">{date(i.order.createdAt)}</small></td>
          <td>{i.quantity}× {i.title}</td>
          <td style={{ maxWidth: 220 }}><small className="dim">{i.order.shipName}<br />{i.order.shipAddress}</small></td>
          <td><StatusPill status={i.order.status} map={ORDER_STATUS} /></td>
          <td className="num">{money(i.unitPriceCents * i.quantity)}</td>
          <td className="num muted">−{money(i.commissionCents)}</td>
          <td className="num"><b>{money(i.sellerNetCents)}</b></td>
          <td>{i.order.status === "PAID" && i.fulfillment === "PENDING"
            ? <form action={shipItem} className="row" style={{ flexWrap: "nowrap" }}><input type="hidden" name="id" value={i.id} />{i.listing.type === "PHYSICAL" && <input className="input" name="tracking" placeholder="Rastreio" style={{ width: 120, padding: "6px 10px" }} aria-label="Código de rastreio" />}<button className="btn btn--ghost btn--sm" type="submit">{i.listing.type === "PHYSICAL" ? "Enviar" : "Entregue"}</button></form>
            : <small className="muted">{i.fulfillment === "PENDING" ? "Aguardando pagamento" : i.fulfillment === "SHIPPED" ? `Enviado ${i.trackingCode ?? ""}` : "Entregue"}</small>}</td>
        </tr>)}</tbody>
      </table></div> : <p className="muted" style={{ marginTop: 16 }}>Nenhuma venda ainda.</p>}
    </>
  );
}
