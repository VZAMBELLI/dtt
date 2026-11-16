import Link from "next/link";
import { LayerExplorer } from "@/components/LayerExplorer";

export const metadata = { title: "Proteção em camadas" };


const principles = [
  ["Defesa em profundidade", "Controles sobrepostos e independentes. A falha de um não compromete o ambiente inteiro."],
  ["Modelo de ameaça primeiro", "Quem é o adversário provável, o que ele quer e qual capacidade tem. A escolha dos controles decorre disso, não de tendência."],
  ["Proporcionalidade", "Controles acima do necessário geram atrito e acabam contornados. O nível certo é o que se sustenta na operação."],
  ["Padrões abertos e verificáveis", "Criptografia pública e auditada, protocolos documentados, testes independentes. Segurança por obscuridade não é controle."],
  ["Assumir a violação", "Projetar para detectar, conter e recuperar. Registro, segmentação e resposta importam tanto quanto prevenção."]
];

export default function Camadas() {
  return (
    <>
      <section className="hero">
        <div className="wrap" style={{ position: "relative", maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <span className="eyebrow">Proteção em camadas</span>
          <h1>Para o nível de segurança <span>que você precisa.</span></h1>
          <p style={{ maxWidth: 700 }}>Defesa em profundidade: cinco camadas de controle — identidade e acesso, endpoints, comunicação e rede, perímetro físico, pessoas e processos. Cada uma reduz a probabilidade ou o impacto do que passou pela anterior. Juntas, elevam o custo do ataque e encurtam o tempo até a detecção.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head"><div><span className="eyebrow">Escolha o seu nível</span><h2>Controles e tecnologias por camada</h2></div></div>
          <LayerExplorer />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <span className="eyebrow">Princípios</span>
          <h2 style={{ fontSize: "clamp(24px,2.8vw,34px)", marginBottom: 24 }}>Princípios de arquitetura</h2>
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
          <blockquote>Proteção não é medo. É reduzir o que está fora do seu controle.</blockquote>
          <div className="creed__body">
            <p>Privacidade é o que permite pensar, conversar e trabalhar sem exposição desnecessária. Protegê-la é uma decisão técnica, não um sinal de culpa.</p>
            <p>Se ainda não tem um modelo de ameaça definido, um especialista pode ajudar a montá-lo. Se já tem, os controles estão organizados por camada.</p>
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
