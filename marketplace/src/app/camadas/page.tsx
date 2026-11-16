import Link from "next/link";
import { LayerExplorer } from "@/components/LayerExplorer";

export const metadata = { title: "Proteção em camadas" };

const principles = [
  ["Nenhuma camada é perfeita", "Toda ferramenta falha em algum momento. Por isso elas se sobrepõem: o que uma deixa passar, a seguinte segura."],
  ["Comece pelo que é simples", "Uma senha única em cada lugar e um celular criptografado já afastam a maior parte dos problemas. O resto vem depois, se fizer sentido."],
  ["Proporção, não excesso", "Proteção demais também pesa: atrapalha a rotina e acaba abandonada. A medida certa é a que você consegue manter."],
  ["Prefira o que pode ser verificado", "Criptografia aberta e auditada, padrões públicos, testes feitos por terceiros. Confiança se constrói com o que pode ser conferido."],
  ["Você decide", "Ninguém conhece seus riscos como você. Nosso papel é explicar com honestidade e deixar a escolha com quem vai viver com ela."]
];

export default function Camadas() {
  return (
    <>
      <section className="hero">
        <div className="wrap" style={{ position: "relative", maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <span className="eyebrow">Proteção em camadas</span>
          <h1>Para o nível de segurança <span>que você precisa.</span></h1>
          <p style={{ maxWidth: 680 }}>Segurança não é um produto que se compra uma vez. É uma sequência de camadas: identidade, dispositivos, comunicação, ambiente e pessoas. Cada uma cobre o que a anterior deixa passar, e juntas tornam o caminho longo demais para quem tenta entrar.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head"><div><span className="eyebrow">Escolha o seu nível</span><h2>As camadas e as tecnologias de cada uma</h2></div></div>
          <LayerExplorer />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <span className="eyebrow">Princípios</span>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,34px)", marginBottom: 24 }}>O que guia as nossas escolhas</h2>
          <ol className="stackl">
            {principles.map(([t, d], i) => (
              <li key={t} className="stackl__row" style={{ gridTemplateColumns: "48px 1fr" }}>
                <span className="mono" style={{ color: "var(--signal)" }}>{String(i + 1).padStart(2, "0")}</span>
                <div><h3 style={{ fontSize: 19, marginBottom: 6 }}>{t}</h3><p className="dim" style={{ margin: 0 }}>{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap creed" style={{ maxWidth: 1000 }}>
          <blockquote>Uma pessoa protegida não é uma pessoa com medo. É uma pessoa que pode escolher.</blockquote>
          <div className="creed__body">
            <p>Quando você cuida da sua privacidade, não está escondendo nada. Está guardando o espaço onde pensa, conversa, trabalha e vive sem precisar pedir licença.</p>
            <p>Esse espaço vale ser defendido com calma, com bom senso e com as ferramentas certas. Se precisar de ajuda para escolher, os especialistas daqui podem orientar. Se já sabe o que quer, o caminho está aberto.</p>
            <div className="row" style={{ marginTop: 8 }}>
              <Link className="btn btn--primary" href="/explorar">Explorar as opções</Link>
              <Link className="btn btn--ghost" href="/explorar?tipo=PROFESSIONAL">Falar com um especialista</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
