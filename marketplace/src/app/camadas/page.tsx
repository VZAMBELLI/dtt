import Link from "next/link";
import { LayerExplorer } from "@/components/LayerExplorer";

export const metadata = { title: "Proteção em camadas" };

const principles = [
  ["Camadas independentes", "Uma falha não derruba tudo."],
  ["Ameaça antes de produto", "Defina o risco, depois o controle."],
  ["Proporção", "Proteção que atrapalha é abandonada."],
  ["Padrão aberto", "Criptografia auditada. Nada de caixa-preta."],
  ["Assuma a invasão", "Detectar e conter importa tanto quanto prevenir."]
];

export default function Camadas() {
  return (
    <>
      <section className="hero">
        <div className="wrap" style={{ position: "relative", maxWidth: 900 }}>
          <span className="eyebrow">Proteção em camadas</span>
          <h1>5 camadas. <span>3 níveis.</span></h1>
          <p>Uma camada cobre a falha da outra. Escolha o nível e veja o que entra.</p>
        </div>
      </section>
      <section className="section"><div className="wrap"><LayerExplorer /></div></section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,32px)", marginBottom: 20 }}>Princípios</h2>
          <ol className="stackl">
            {principles.map(([t, d], i) => (
              <li key={t} className="stackl__row" style={{ gridTemplateColumns: "48px 1fr" }}>
                <span className="mono" style={{ color: "var(--signal)" }}>0{i + 1}</span>
                <div><h3 style={{ fontSize: 18, marginBottom: 4 }}>{t}</h3><p className="dim" style={{ margin: 0 }}>{d}</p></div>
              </li>
            ))}
          </ol>
          <div className="row" style={{ marginTop: 28 }}>
            <Link className="btn btn--primary" href="/explorar">Ver produtos</Link>
            <Link className="btn btn--ghost" href="/explorar?tipo=PROFESSIONAL">Falar com especialista</Link>
          </div>
        </div>
      </section>
    </>
  );
}
