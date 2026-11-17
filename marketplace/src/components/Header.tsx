import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { logout } from "@/app/actions";
import { Icon } from "./Icon";
import { Logo } from "./ui";
import { TYPES, TYPE_KEYS } from "@/lib/format";

export async function Header() {
  const [user, cart] = await Promise.all([currentUser(), readCart()]);
  const count = cart.reduce((s, l) => s + l.q, 0);
  return (
    <header className="top">
      <div className="wrap">
        <div className="top__bar">
          <Link href="/" className="brand" aria-label="Secure Privacy Market — início">
            <Logo /><span>SECURE<b>PRIVACY</b></span><em>MARKET</em>
          </Link>
          <form action="/explorar" className="search" role="search">
            <label htmlFor="q-top" className="sr">Buscar</label>
            <input id="q-top" name="q" placeholder="Buscar" />
            <button type="submit" aria-label="Buscar"><Icon name="search" size={16} /></button>
          </form>
          <nav className="top__nav" aria-label="Conta">
            {user?.store && <Link href="/painel" className="hide-sm"><Icon name="store" size={16} />Painel</Link>}
            <Link href={user?.store ? "/painel/anuncios/novo" : "/vender"} className="btn btn--primary btn--sm nav-sell">Anunciar</Link>
            {user?.role === "ADMIN" && <Link href="/admin" className="hide-sm">Admin</Link>}
            {user
              ? <><Link href="/conta"><Icon name="user" size={16} /><span className="hide-sm">{user.name.split(" ")[0]}</span></Link>
                  <form action={logout}><button type="submit" className="hide-sm">Sair</button></form></>
              : <Link href="/entrar">Entrar</Link>}
            <Link href="/carrinho" aria-label={`Carrinho, ${count} itens`}><Icon name="cart" size={18} />{count > 0 && <span className="badge-count">{count}</span>}</Link>
          </nav>
        </div>
        <nav className="cats" aria-label="Tipos">
          <Link href="/camadas">Proteção em camadas</Link>
          <Link href="/explorar">Tudo</Link>
          {TYPE_KEYS.map(t => <Link key={t} href={`/explorar?tipo=${t}`}>{TYPES[t].label}</Link>)}
          <Link href="/explorar?ordem=destaques">Destaques</Link>
          <Link href="/politica">Curadoria e itens proibidos</Link>
        </nav>
      </div>
    </header>
  );
}
