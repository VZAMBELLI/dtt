import Link from "next/link";
export default function NotFound() {
  return <div className="wrap section"><div className="empty"><h3>Página não encontrada</h3><p>O endereço pode ter mudado ou o anúncio não está mais disponível.</p><Link className="btn btn--primary" href="/explorar">Explorar o marketplace</Link></div></div>;
}
