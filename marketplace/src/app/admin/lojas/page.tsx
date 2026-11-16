import Link from "next/link";
import { db } from "@/lib/db";
import { adminStore } from "@/app/actions";
import { StatusPill } from "@/components/ui";
import { STORE_STATUS, date } from "@/lib/format";

export const metadata = { title: "Vendedores" };

function Btn({ id, action, label, danger }: { id: string; action: string; label: string; danger?: boolean }) {
  return <form action={adminStore}><input type="hidden" name="id" value={id} /><input type="hidden" name="action" value={action} /><button className={`btn btn--sm ${danger ? "btn--danger" : "btn--ghost"}`} type="submit">{label}</button></form>;
}

export default async function Lojas() {
  const stores = await db.store.findMany({ include: { user: { select: { email: true } }, _count: { select: { listings: true } } }, orderBy: [{ status: "desc" }, { createdAt: "desc" }] });
  return (
    <>
      <h1 className="page-title">Vendedores</h1>
      <p className="dim">Confira documento e credenciais antes de aprovar. Serviços de segurança privada exigem autorização da Polícia Federal.</p>
      <div className="stack" style={{ marginTop: 16 }}>{stores.map(s => (
        <div key={s.id} className="card stack" style={{ gap: 10 }}>
          <div className="row between">
            <div><b>{s.status === "APPROVED" ? <Link className="link" href={`/loja/${s.slug}`}>{s.name}</Link> : s.name}</b> <span className="muted">· {s.kind === "PROFISSIONAL" ? "Profissional" : "Empresa"} · {s.city}</span></div>
            <div className="row"><StatusPill status={s.status} map={STORE_STATUS} />{s.verified && <span className="pill pill--ok">Verificado</span>}</div>
          </div>
          <small className="muted mono">{s.document} · {s.user.email} · {s._count.listings} anúncios · desde {date(s.createdAt)}</small>
          <p className="dim" style={{ margin: 0 }}>{s.bio}</p>
          {s.credentials && <small>Credenciais: <span className="dim">{s.credentials}</span></small>}
          <div className="row">
            {s.status !== "APPROVED" && <Btn id={s.id} action="approve" label="Aprovar" />}
            {s.status === "PENDING" && <Btn id={s.id} action="reject" label="Recusar" danger />}
            {s.status === "APPROVED" && <Btn id={s.id} action="suspend" label="Suspender" danger />}
            <Btn id={s.id} action={s.verified ? "unverify" : "verify"} label={s.verified ? "Remover selo" : "Dar selo de verificado"} />
            <form action={adminStore} className="row" style={{ flexWrap: "nowrap" }}>
              <input type="hidden" name="id" value={s.id} /><input type="hidden" name="action" value="rate" />
              <label className="sr" htmlFor={`rate-${s.id}`}>Comissão %</label>
              <input id={`rate-${s.id}`} className="input" name="rate" defaultValue={(s.commissionRate * 100).toString()} style={{ width: 70, padding: "6px 10px" }} />
              <button className="btn btn--sm btn--ghost" type="submit">% comissão</button>
            </form>
          </div>
        </div>))}</div>
    </>
  );
}
