import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { applySeller, signup } from "@/app/actions";
import { Flash, type SP } from "@/components/ui";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Vender no marketplace" };

export default async function Vender({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const user = await currentUser();
  if (user?.store) redirect("/painel");
  return (
    <div className="wrap section">
      <div className="product">
        <div>
          <span className="eyebrow">Para vendedores</span>
          <h1 className="page-title">Cadastre sua loja.</h1>
          <p className="dim" style={{ fontSize: 17 }}>Produtos, serviços, software ou horas técnicas.</p>
          <div className="steps">
            <div className={!user ? "on" : ""}><span className="mono">ETAPA 1</span><b>Conta</b><small>Nome, e-mail e senha</small></div>
            <div className={user ? "on" : ""}><span className="mono">ETAPA 2</span><b>Dados da loja</b><small>CPF/CNPJ, cidade e credenciais</small></div>
            <div><span className="mono">ETAPA 3</span><b>Anúncios</b><small>Produtos e serviços no painel</small></div>
          </div>
        </div>
        <div className="card">
          {!user ? (
            <form action={signup} className="form">
              <h2 style={{ fontSize: 22 }}>Etapa 1 · Criar sua conta</h2>
              <Flash sp={sp} />
              <input type="hidden" name="next" value="/vender" />
              <label className="field"><span>Nome do responsável</span><input id="v-name" name="name" autoComplete="name" required /></label>
              <label className="field"><span>E-mail</span><input id="v-email" name="email" type="email" autoComplete="email" required /></label>
              <label className="field"><span>Senha</span><input id="v-password" name="password" type="password" minLength={8} autoComplete="new-password" required /><small>Mínimo de 8 caracteres.</small></label>
              <button className="btn btn--primary btn--block" type="submit">Continuar para dados da loja</button>
              <p className="dim" style={{ margin: 0, fontSize: 14 }}>Já tem conta? <Link className="link" href="/entrar?next=/vender">Entrar</Link></p>
            </form>
          ) : (
            <form action={applySeller} className="form">
              <h2 style={{ fontSize: 22 }}>Etapa 2 · Dados da loja</h2>
              <Flash sp={sp} />
              <div className="choice">
                <label><input type="radio" name="kind" value="EMPRESA" defaultChecked /><span>Empresa (CNPJ)</span></label>
                <label><input type="radio" name="kind" value="PROFISSIONAL" /><span>Profissional (CPF ou MEI)</span></label>
              </div>
              <label className="field"><span>Nome da loja ou nome profissional</span><input id="st-name" name="name" required /></label>
              <div className="form-row">
                <label className="field"><span>CPF ou CNPJ</span><input id="st-doc" name="document" inputMode="numeric" required /></label>
                <label className="field"><span>Cidade / UF</span><input id="st-city" name="city" required /></label>
              </div>
              <label className="field"><span>O que você faz</span><textarea id="st-bio" name="bio" rows={4} required /></label>
              <label className="field"><span>Certificações e registros</span><input id="st-cred" name="credentials" placeholder="OSCP, ISO 27001, autorização PF" /><small>Segurança privada exige autorização da PF.</small></label>
              <label className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start", fontSize: 14 }}><input id="st-terms" type="checkbox" name="terms" style={{ marginTop: 4 }} /><span className="dim">Aceito as <Link className="link" href="/politica">regras</Link>.</span></label>
              <button className="btn btn--primary btn--block" type="submit">Enviar para análise</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
