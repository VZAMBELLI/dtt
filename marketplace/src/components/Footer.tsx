import Link from "next/link";
import { Logo } from "./ui";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__in">
          <div>
            <Link href="/" className="brand"><Logo /><span>SECURE<b>PRIVACY</b></span></Link>
            <p style={{ marginTop: 14, maxWidth: 320 }}>Marketplace curado de segurança: equipamentos, serviços, produtos digitais e especialistas verificados.</p>
          </div>
          <div><h5>Comprar</h5><Link href="/explorar?tipo=PHYSICAL">Equipamentos</Link><Link href="/explorar?tipo=SERVICE">Serviços</Link><Link href="/explorar?tipo=DIGITAL">Digitais</Link><Link href="/explorar?tipo=PROFESSIONAL">Profissionais</Link></div>
          <div><h5>Vender</h5><Link href="/vender">Seja um vendedor</Link><Link href="/painel">Painel do vendedor</Link><Link href="/politica">Regras de curadoria</Link></div>
          <div><h5>Conta</h5><Link href="/conta">Meus pedidos</Link><Link href="/carrinho">Carrinho</Link><Link href="/entrar">Entrar</Link></div>
        </div>
        <p className="foot__legal mono">© {new Date().getFullYear()} Secure Privacy · Todos os vendedores passam por verificação. Itens de venda proibida ou restrita não são aceitos.</p>
      </div>
    </footer>
  );
}
