import Link from "next/link";
import { requireSeller } from "@/lib/auth";
import { StatusPill } from "@/components/ui";
import { STORE_STATUS } from "@/lib/format";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const { store } = await requireSeller();
  return (
    <div className="wrap dash">
      <nav className="side" aria-label="Painel do vendedor">
        <h4>{store.name}</h4>
        <Link href="/painel">Visão geral</Link>
        <Link href="/painel/anuncios">Anúncios</Link>
        <Link href="/painel/anuncios/novo">Novo anúncio</Link>
        <Link href="/painel/vendas">Vendas</Link>
        <Link href="/painel/orcamentos">Orçamentos</Link>
        {store.status === "APPROVED" && <Link href={`/loja/${store.slug}`}>Ver minha loja ↗</Link>}
        <div style={{ padding: "12px" }}><StatusPill status={store.status} map={STORE_STATUS} /></div>
      </nav>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}
