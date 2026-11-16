import Link from "next/link";
import { db } from "@/lib/db";
import { Icon, TYPE_ICON } from "@/components/Icon";
import { ListingCard } from "@/components/ui";
import { LayerExplorer } from "@/components/LayerExplorer";
import { TYPES, TYPE_KEYS } from "@/lib/format";

export const dynamic = "force-dynamic";
const inc = { category: true, store: true, reviews: { select: { rating: true } } } as const;
const live = { status: "ACTIVE", store: { status: "APPROVED" } };

export default async function Home() {
  const [featured, services, physical, counts, stores] = await Promise.all([
    db.listing.findMany({ where: { ...live, featured: true }, include: inc, take: 8, orderBy: { createdAt: "desc" } }),
    db.listing.findMany({ where: { ...live, type: { in: ["SERVICE", "PROFESSIONAL"] } }, include: inc, take: 4, orderBy: { createdAt: "desc" } }),
    db.listing.findMany({ where: { ...live, type: "PHYSICAL" }, include: inc, take: 4, orderBy: { createdAt: "desc" } }),
    db.listing.groupBy({ by: ["type"], where: live, _count: true }),
    db.store.count({ where: { status: "APPROVED", verified: true } })
  ]);
  const n = (t: string) => counts.find(c => c.type === t)?._count ?? 0;

  return (
    <>
      <section className="hero">
        <div className="wrap hero__in">
          <div>
            <span className="eyebrow">Proteção em camadas</span>
            <h1>Proteção em camadas. <span>Para o nível de segurança que você precisa.</span></h1>
            <p>Nenhuma ferramenta protege tudo sozinha. Cada camada cobre o que a anterior deixa passar. Aqui você encontra equipamentos, tecnologias e pessoas para montar a sua, no seu ritmo e do seu jeito.</p>
            <form action="/explorar" className="hero__search" role="search">
              <label htmlFor="q-hero" className="sr">O que você precisa proteger?</label>
              <input id="q-hero" name="q" placeholder="O que você precisa proteger?" />
              <button className="btn btn--primary" type="submit">Buscar <Icon name="arrow" size={16} /></button>
            </form>
            <div className="hero__tags">
              {["pentest", "câmera", "fechadura", "LGPD", "pânico", "proteção executiva"].map(t =>
                <Link key={t} href={`/explorar?q=${encodeURIComponent(t)}`}>{t}</Link>)}
            </div>
          </div>
          <div className="trustbox">
            <div><Icon name="shield" /><p><b>Vendedores verificados</b><span>{stores} lojas e profissionais com documentos e credenciais conferidos.</span></p></div>
            <div><Icon name="eye" /><p><b>Curadoria de cada anúncio</b><span>Itens de venda proibida ou restrita não entram no catálogo.</span></p></div>
            <div><Icon name="lock" /><p><b>Pagamento protegido</b><span>O valor só é repassado ao vendedor depois da entrega confirmada.</span></p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <div><span className="eyebrow">Escolha o seu nível</span><h2>Cada camada no lugar certo, nem mais nem menos.</h2></div>
            <Link href="/camadas" className="link">Entender as camadas →</Link>
          </div>
          <LayerExplorer compact />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap creed">
          <blockquote>Privacidade não é algo que se esconde. É o espaço onde uma pessoa pode ser livre.</blockquote>
          <div className="creed__body">
            <p>Acreditamos que cada pessoa tem o direito de proteger o que é seu: sua casa, seu trabalho, suas conversas, sua rotina. Esse direito não deveria depender de quanto alguém sabe sobre tecnologia.</p>
            <p>Por isso este lugar existe. Não para dizer a ninguém do que ter medo, mas para colocar as ferramentas certas ao alcance de quem decide se proteger. Quem melhor conhece os seus riscos é você. A escolha continua sendo sua.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><h2>Por onde você quer começar?</h2></div>
          <div className="types">
            {TYPE_KEYS.map(t => (
              <Link key={t} href={`/explorar?tipo=${t}`} className="type">
                <span className="n">{n(t)} ofertas</span>
                <Icon name={TYPE_ICON[t]} />
                <h3>{TYPES[t].label}</h3>
                <p>{TYPES[t].desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><div><span className="eyebrow">Selecionados</span><h2>Destaques da curadoria</h2></div><Link href="/explorar?ordem=destaques" className="link">Ver todos →</Link></div>
          <div className="grid">{featured.map(l => <ListingCard key={l.id} l={l} />)}</div>
        </div>
      </section>}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><div><span className="eyebrow">Especialistas</span><h2>Serviços e profissionais</h2></div><Link href="/explorar?tipo=SERVICE" className="link">Ver serviços →</Link></div>
          <div className="grid">{services.map(l => <ListingCard key={l.id} l={l} />)}</div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><div><span className="eyebrow">Equipamentos</span><h2>Proteção física e eletrônica</h2></div><Link href="/explorar?tipo=PHYSICAL" className="link">Ver equipamentos →</Link></div>
          <div className="grid">{physical.map(l => <ListingCard key={l.id} l={l} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sellcta">
            <div>
              <span className="eyebrow">Para vendedores</span>
              <h2>Se você constrói uma das camadas, este espaço também é seu.</h2>
              <p className="dim">Empresas e profissionais independentes vendem aqui lado a lado. Você se cadastra, a verificação acontece, e o seu trabalho chega a pessoas que já entenderam por que ele importa.</p>
              <Link href="/vender" className="btn btn--primary">Quero vender <Icon name="arrow" size={16} /></Link>
            </div>
            <ul>
              <li>Selo de vendedor verificado</li>
              <li>Recebimento automático com divisão de pagamento</li>
              <li>Pedidos de orçamento para serviços sob medida</li>
              <li>Painel com vendas, estoque e solicitações</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
