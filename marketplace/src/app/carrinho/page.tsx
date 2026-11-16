import Link from "next/link";
import { cartDetails } from "@/lib/cart";
import { setCartQty } from "@/app/actions";
import { Flash, Visual, one, type SP } from "@/components/ui";
import { money } from "@/lib/format";

export const metadata = { title: "Carrinho" };

export default async function Carrinho({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { items, totalCents, count } = await cartDetails();
  const stores = new Set(items.map(i => i.listing.storeId)).size;
  return (
    <div className="wrap section">
      <h1 className="page-title">Carrinho</h1>
      {one(sp.ok) && <p className="alert alert--ok" style={{ margin: "12px 0" }}>Item adicionado ao carrinho.</p>}
      <Flash sp={sp} />
      {!items.length ? (
        <div className="empty" style={{ marginTop: 24 }}><h3>Seu carrinho está vazio</h3><p>Serviços sob orçamento são solicitados direto na página do anúncio.</p><Link href="/explorar" className="btn btn--primary">Explorar o marketplace</Link></div>
      ) : (
        <div className="cart" style={{ marginTop: 24 }}>
          <div>
            {items.map(({ listing: l, q, subtotal }) => (
              <div key={l.id} className="line">
                <Link href={`/produto/${l.slug}`}><Visual icon={l.category.icon} /></Link>
                <div style={{ minWidth: 0 }}>
                  <Link href={`/produto/${l.slug}`}><b>{l.title}</b></Link>
                  <div className="muted" style={{ fontSize: 13 }}>{l.store.name} · {money(l.priceCents!)}{l.priceUnit !== "un" ? ` / ${l.priceUnit}` : ""}</div>
                  <form action={setCartQty} className="row" style={{ marginTop: 8 }}>
                    <input type="hidden" name="id" value={l.id} />
                    <label className="sr" htmlFor={`q-${l.id}`}>Quantidade</label>
                    <input id={`q-${l.id}`} className="input qty" type="number" name="q" min={0} max={l.stock ?? 99} defaultValue={q} />
                    <button className="btn btn--ghost btn--sm" type="submit">Atualizar</button>
                    <button className="btn btn--sm" type="submit" name="q" value="0">Remover</button>
                  </form>
                </div>
                <b className="num">{money(subtotal)}</b>
              </div>
            ))}
          </div>
          <aside className="card summary">
            <dl>
              <dt>Itens ({count})</dt><dd>{money(totalCents)}</dd>
              <dt>Vendedores</dt><dd>{stores}</dd>
              <dt>Frete</dt><dd>Combinado com o vendedor</dd>
              <dt className="total">Total</dt><dd className="total">{money(totalCents)}</dd>
            </dl>
            <Link href="/checkout" className="btn btn--primary btn--block">Finalizar compra</Link>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>Um único pagamento. O valor de cada vendedor é separado automaticamente.</p>
          </aside>
        </div>
      )}
    </div>
  );
}
