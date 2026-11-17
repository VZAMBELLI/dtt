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
            <h1>Proteção em camadas. <span>No nível que você precisa.</span></h1>
            <p>Equipamentos, software, serviços e especialistas verificados.</p>
            <form action="/explorar" className="hero__search" role="search">
              <label htmlFor="q-hero" className="sr">O que você precisa proteger?</label>
              <input id="q-hero" name="q" placeholder="O que você precisa proteger?" />
              <button className="btn btn--primary" type="submit">Buscar <Icon name="arrow" size={16} /></button>
            </form>
            <div className="row" style={{ marginTop: 18 }}>
              <Link href="/vender" className="btn btn--ghost"><Icon name="store" size={16} /> Anunciar produto ou serviço</Link>
            </div>
            <div className="hero__tags">
              {["pentest", "câmera", "fechadura", "LGPD", "pânico", "proteção executiva"].map(t =>
                <Link key={t} href={`/explorar?q=${encodeURIComponent(t)}`}>{t}</Link>)}
            </div>
          </div>
          <div className="trustbox">
            <div><Icon name="shield" /><p><b>Vendedores verificados</b><span>Documento e credencial conferidos.</span></p></div>
            <div><Icon name="eye" /><p><b>Anúncios revisados</b><span>Item proibido não entra.</span></p></div>
            <div><Icon name="lock" /><p><b>Pagamento protegido</b><span>Vendedor recebe após a entrega.</span></p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="head">
            <h2>Escolha o nível</h2>
            <Link href="/camadas" className="link">Ver detalhes →</Link>
          </div>
          <LayerExplorer compact />
        </div>
      </section>


      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><h2>Categorias</h2></div>
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
          <div className="head"><h2>Destaques</h2><Link href="/explorar?ordem=destaques" className="link">Ver todos →</Link></div>
          <div className="grid">{featured.map(l => <ListingCard key={l.id} l={l} />)}</div>
        </div>
      </section>}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><h2>Serviços e profissionais</h2><Link href="/explorar?tipo=SERVICE" className="link">Ver serviços →</Link></div>
          <div className="grid">{services.map(l => <ListingCard key={l.id} l={l} />)}</div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head"><h2>Equipamentos</h2><Link href="/explorar?tipo=PHYSICAL" className="link">Ver equipamentos →</Link></div>
          <div className="grid">{physical.map(l => <ListingCard key={l.id} l={l} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sellcta">
            <div>
              <h2>Venda aqui.</h2>
              <p className="dim">Empresa ou profissional. Cadastro em 3 etapas.</p>
              <Link href="/vender" className="btn btn--primary">Cadastrar loja <Icon name="arrow" size={16} /></Link>
            </div>
            <ul>
              <li>Selo de verificado</li>
              <li>Pagamento dividido automático</li>
              <li>Orçamentos no painel</li>
              <li>Vendas e estoque em um lugar</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
