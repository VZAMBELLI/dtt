import Link from "next/link";
import { signup } from "@/app/actions";
import { Flash, one, type SP } from "@/components/ui";

export const metadata = { title: "Criar conta" };

export default async function Cadastrar({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = one(sp.next) ?? "/";
  return (
    <div className="wrap">
      <div className="auth card">
        <h1 className="page-title">Criar conta</h1>
        <p className="dim">Uma conta serve para comprar e, se quiser, para vender.</p>
        <form action={signup} className="form">
          <Flash sp={sp} />
          <input type="hidden" name="next" value={next} />
          <label className="field"><span>Nome</span><input id="su-name" name="name" autoComplete="name" required /></label>
          <label className="field"><span>E-mail</span><input id="su-email" name="email" type="email" autoComplete="email" required /></label>
          <label className="field"><span>Senha</span><input id="su-password" name="password" type="password" minLength={8} autoComplete="new-password" required /><small>Mínimo de 8 caracteres.</small></label>
          <button className="btn btn--primary btn--block" type="submit">Criar conta</button>
        </form>
        <p className="dim" style={{ marginTop: 18 }}>Já tem conta? <Link className="link" href={`/entrar?next=${encodeURIComponent(next)}`}>Entrar</Link></p>
      </div>
    </div>
  );
}
