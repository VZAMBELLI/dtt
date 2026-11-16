import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="wrap dash">
      <nav className="side" aria-label="Administração">
        <h4>Administração</h4>
        <Link href="/admin">Visão geral</Link>
        <Link href="/admin/lojas">Vendedores</Link>
        <Link href="/admin/anuncios">Curadoria de anúncios</Link>
        <Link href="/admin/pedidos">Pedidos</Link>
      </nav>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}
