import Link from "next/link";
import { login } from "@/app/actions";
import { Flash, one, type SP } from "@/components/ui";

export const metadata = { title: "Entrar" };

export default async function Entrar({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = one(sp.next) ?? "/";
  return (
    <div className="wrap">
      <div className="auth card">
        <h1 className="page-title">Entrar</h1>
        <p className="dim">Acesse sua conta para comprar, pedir orçamentos ou gerenciar sua loja.</p>
        <form action={login} className="form">
          <Flash sp={sp} />
          <input type="hidden" name="next" value={next} />
          <label className="field"><span>E-mail</span><input id="login-email" name="email" type="email" autoComplete="email" required /></label>
          <label className="field"><span>Senha</span><input id="login-password" name="password" type="password" autoComplete="current-password" required /></label>
          <button className="btn btn--primary btn--block" type="submit">Entrar</button>
        </form>
        <p className="dim" style={{ marginTop: 18 }}>Não tem conta? <Link className="link" href={`/cadastrar?next=${encodeURIComponent(next)}`}>Criar conta</Link></p>
        <p className="alert alert--info mono" style={{ marginTop: 12 }}>Contas de demonstração (senha senha123): cliente@exemplo.com · vendedor@exemplo.com · admin@exemplo.com</p>
      </div>
    </div>
  );
}
