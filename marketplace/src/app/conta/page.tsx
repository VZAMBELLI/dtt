import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { StatusPill, one, type SP } from "@/components/ui";
import { ORDER_STATUS, money, date } from "@/lib/format";

export const metadata = { title: "Minha conta" };

export default async function Conta({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const user = await requireUser("/conta");
  const [orders, quotes] = await Promise.all([
    db.order.findMany({ where: { buyerId: user.id }, include: { _count: { select: { items: true } } }, orderBy: { createdAt: "desc" } }),
    db.quoteRequest.findMany({ where: { buyerId: user.id }, include: { listing: true, store: true }, orderBy: { createdAt: "desc" } })
  ]);
  return (
    <div className="wrap section">
      <span className="eyebrow">Minha conta</span>
      <h1 className="page-title">Olá, {user.name.split(" ")[0]}</h1>
      <p className="dim">{user.email}</p>
      {one(sp.orcamento) && <p className="alert alert--ok">Pedido de orçamento enviado. O vendedor responde por aqui.</p>}

      <h2 style={{ fontSize: 22, margin: "36px 0 14px" }}>Pedidos</h2>
      {orders.length ? <div className="table-wrap"><table className="table">
        <thead><tr><th>Pedido</th><th>Data</th><th>Itens</th><th>Status</th><th className="num">Total</th></tr></thead>
        <tbody>{orders.map(o => <tr key={o.id}><td><Link className="link mono" href={`/pedidos/${o.code}`}>{o.code}</Link></td><td>{date(o.createdAt)}</td><td>{o._count.items}</td><td><StatusPill status={o.status} map={ORDER_STATUS} /></td><td className="num">{money(o.totalCents)}</td></tr>)}</tbody>
      </table></div> : <div className="empty"><p>Você ainda não fez pedidos.</p><Link className="btn btn--ghost" href="/explorar">Explorar</Link></div>}

      <h2 style={{ fontSize: 22, margin: "36px 0 14px" }}>Orçamentos</h2>
      {quotes.length ? <div className="stack">{quotes.map(q => (
        <div key={q.id} className="card stack" style={{ gap: 8 }}>
          <div className="row between"><Link className="link" href={`/produto/${q.listing.slug}`}><b>{q.listing.title}</b></Link><StatusPill status={q.status} map={{ OPEN: "Aguardando resposta", ANSWERED: "Respondido", CLOSED: "Encerrado" }} /></div>
          <small className="muted">{q.store.name} · {date(q.createdAt)}</small>
          <p className="dim" style={{ margin: 0 }}>{q.message}</p>
          {q.reply && <p className="alert alert--info" style={{ margin: 0 }}><b>Resposta:</b> {q.reply}</p>}
        </div>))}</div> : <p className="muted">Nenhum orçamento solicitado.</p>}
    </div>
  );
}
