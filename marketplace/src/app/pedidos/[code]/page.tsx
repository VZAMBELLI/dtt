import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { confirmSimulatedPayment, confirmReceived } from "@/app/actions";
import { isSimulated } from "@/lib/payments";
import { StatusPill, one, type SP } from "@/components/ui";
import { ORDER_STATUS, money, date } from "@/lib/format";

export default async function Pedido({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: SP }) {
  const { code } = await params;
  const sp = await searchParams;
  const user = await requireUser(`/pedidos/${code}`);
  const o = await db.order.findFirst({ where: { code, buyerId: user.id }, include: { items: { include: { store: true, listing: true } } } });
  if (!o) notFound();
  return (
    <div className="wrap section" style={{ maxWidth: 860 }}>
      <span className="eyebrow">Pedido {o.code}</span>
      <div className="row between"><h1 className="page-title">{one(sp.pago) ? "Pagamento confirmado" : "Pedido recebido"}</h1><StatusPill status={o.status} map={ORDER_STATUS} /></div>
      <p className="dim">Feito em {date(o.createdAt)} · {o.paymentMethod === "CARTAO" ? "Cartão" : o.paymentMethod === "PIX" ? "Pix" : "Boleto"}</p>

      {o.status === "PENDING_PAYMENT" && (
        <div className="card stack" style={{ margin: "20px 0" }}>
          <b>Aguardando pagamento de {money(o.totalCents)}</b>
          {isSimulated()
            ? <><p className="dim" style={{ margin: 0 }}>Ambiente de demonstração: nenhum valor real é cobrado.</p>
                <form action={confirmSimulatedPayment}><input type="hidden" name="code" value={o.code} /><button className="btn btn--primary" type="submit">Confirmar pagamento (simulação)</button></form></>
            : <p className="dim">Siga as instruções enviadas pelo meio de pagamento.</p>}
        </div>
      )}

      <div className="table-wrap" style={{ marginTop: 20 }}>
        <table className="table">
          <thead><tr><th>Item</th><th>Vendedor</th><th>Entrega</th><th className="num">Qtd.</th><th className="num">Total</th></tr></thead>
          <tbody>{o.items.map(i => (
            <tr key={i.id}>
              <td><Link className="link" href={`/produto/${i.listing.slug}`}>{i.title}</Link></td>
              <td>{i.store.name}</td>
              <td>{i.fulfillment === "PENDING" ? "Preparando" : i.fulfillment === "SHIPPED" ? `Enviado${i.trackingCode ? ` · ${i.trackingCode}` : ""}` : "Entregue"}</td>
              <td className="num">{i.quantity}</td>
              <td className="num">{money(i.unitPriceCents * i.quantity)}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <p style={{ textAlign: "right", fontSize: 20, fontWeight: 600, marginTop: 14 }}>Total {money(o.totalCents)}</p>
      <p className="muted">Entrega: {o.shipName} · {o.shipAddress}</p>

      {["PAID", "SHIPPED"].includes(o.status) && (
        <form action={confirmReceived} className="card row between" style={{ marginTop: 20 }}>
          <input type="hidden" name="code" value={o.code} />
          <span className="dim">Recebeu tudo certo? Confirmar libera o repasse aos vendedores.</span>
          <button className="btn btn--ghost" type="submit">Confirmar recebimento</button>
        </form>
      )}
      <p style={{ marginTop: 24 }}><Link className="link" href="/conta">← Meus pedidos</Link></p>
    </div>
  );
}
