import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { applySeller } from "@/app/actions";
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
          <h1 className="page-title">Venda para quem leva segurança a sério.</h1>
          <p className="dim" style={{ fontSize: 17 }}>Empresas e profissionais independentes podem anunciar equipamentos, serviços, produtos digitais e horas técnicas. Cada vendedor passa por verificação antes de publicar.</p>
          <div className="stack" style={{ marginTop: 28 }}>
            {[["shield", "Selo de verificado", "Documentos e credenciais conferidos aumentam a confiança de quem compra."],
              ["bolt", "Recebimento automático", "O pagamento é dividido na hora: sua parte vai para você, a comissão para a plataforma."],
              ["doc", "Orçamentos sob medida", "Serviços complexos recebem pedidos de orçamento direto no seu painel."],
              ["store", "Painel completo", "Anúncios, estoque, vendas, envios e solicitações em um só lugar."]].map(([i, t, d]) =>
              <div key={t} className="row" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}><span className="avatar"><Icon name={i} /></span><div><b>{t}</b><p className="dim" style={{ margin: 0, fontSize: 14 }}>{d}</p></div></div>)}
          </div>
        </div>
        <div className="card">
          {!user ? (
            <div className="stack">
              <h2 style={{ fontSize: 22 }}>Comece criando sua conta</h2>
              <p className="dim">Depois você preenche os dados da loja para análise.</p>
              <Link className="btn btn--primary btn--block" href="/cadastrar?next=/vender">Criar conta</Link>
              <Link className="btn btn--ghost btn--block" href="/entrar?next=/vender">Já tenho conta</Link>
            </div>
          ) : (
            <form action={applySeller} className="form">
              <h2 style={{ fontSize: 22 }}>Dados da loja</h2>
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
              <label className="field"><span>Sobre você ou sua empresa</span><textarea id="st-bio" name="bio" rows={4} required /></label>
              <label className="field"><span>Certificações e registros</span><input id="st-cred" name="credentials" placeholder="Ex.: OSCP, ISO 27001 LI, autorização da Polícia Federal" /><small>Serviços de segurança privada exigem autorização da Polícia Federal.</small></label>
              <label className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start", fontSize: 14 }}><input id="st-terms" type="checkbox" name="terms" style={{ marginTop: 4 }} /><span className="dim">Li e aceito as <Link className="link" href="/politica">regras de curadoria e a lista de itens proibidos</Link>.</span></label>
              <button className="btn btn--primary btn--block" type="submit">Enviar para análise</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
