import { db } from "@/lib/db";
import { requireSeller } from "@/lib/auth";
import { replyQuote } from "@/app/actions";
import { Flash, StatusPill, type SP } from "@/components/ui";
import { date } from "@/lib/format";

export const metadata = { title: "Orçamentos" };

export default async function Orcamentos({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { store } = await requireSeller();
  const qs = await db.quoteRequest.findMany({ where: { storeId: store.id }, include: { listing: true, buyer: { select: { name: true, email: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <h1 className="page-title">Pedidos de orçamento</h1>
      <Flash sp={sp} />
      {qs.length ? <div className="stack" style={{ marginTop: 16 }}>{qs.map(q => (
        <div key={q.id} className="card stack" style={{ gap: 10 }}>
          <div className="row between"><b>{q.listing.title}</b><StatusPill status={q.status} map={{ OPEN: "Aberto", ANSWERED: "Respondido", CLOSED: "Encerrado" }} /></div>
          <small className="muted">{q.buyer.name}{q.company && ` · ${q.company}`} · {q.buyer.email} · {date(q.createdAt)}</small>
          <p className="dim" style={{ margin: 0, whiteSpace: "pre-line" }}>{q.message}</p>
          {q.reply
            ? <p className="alert alert--info" style={{ margin: 0 }}><b>Sua resposta:</b> {q.reply}</p>
            : <form action={replyQuote} className="form"><input type="hidden" name="id" value={q.id} /><label className="field"><span>Resposta / proposta</span><textarea id={`reply-${q.id}`} name="reply" rows={3} required /></label><button className="btn btn--primary btn--sm" type="submit" style={{ alignSelf: "flex-start" }}>Enviar resposta</button></form>}
        </div>))}</div> : <p className="muted" style={{ marginTop: 16 }}>Nenhum pedido de orçamento ainda.</p>}
    </>
  );
}
