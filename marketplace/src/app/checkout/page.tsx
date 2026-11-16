import { Fragment } from "react";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { cartDetails } from "@/lib/cart";
import { checkout } from "@/app/actions";
import { Flash, type SP } from "@/components/ui";
import { money } from "@/lib/format";

export const metadata = { title: "Finalizar compra" };

export default async function Checkout({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const user = await requireUser("/checkout");
  const { items, totalCents } = await cartDetails();
  if (!items.length) redirect("/carrinho");
  const shipping = items.some(i => i.listing.type === "PHYSICAL");
  return (
    <div className="wrap section">
      <h1 className="page-title">Finalizar compra</h1>
      <div className="cart" style={{ marginTop: 24 }}>
        <form action={checkout} className="form card">
          <Flash sp={sp} />
          {shipping && <>
            <h2 style={{ fontSize: 18 }}>Entrega</h2>
            <label className="field"><span>Nome de quem recebe</span><input id="ship-name" name="shipName" defaultValue={user.name} autoComplete="name" required /></label>
            <label className="field"><span>Endereço completo</span><textarea id="ship-address" name="shipAddress" rows={3} placeholder="Rua, número, complemento, bairro, cidade, UF, CEP" autoComplete="street-address" required /></label>
          </>}
          <h2 style={{ fontSize: 18 }}>Pagamento</h2>
          <div className="choice">
            <label><input type="radio" name="method" value="PIX" defaultChecked /><span>Pix</span></label>
            <label><input type="radio" name="method" value="CARTAO" /><span>Cartão de crédito</span></label>
            <label><input type="radio" name="method" value="BOLETO" /><span>Boleto</span></label>
          </div>
          <button className="btn btn--primary btn--block" type="submit">Confirmar pedido · {money(totalCents)}</button>
        </form>
        <aside className="card summary">
          <dl>
            {items.map(i => <Fragment key={i.listing.id}><dt>{i.q}× {i.listing.title}</dt><dd>{money(i.subtotal)}</dd></Fragment>)}
            <dt className="total">Total</dt><dd className="total">{money(totalCents)}</dd>
          </dl>
        </aside>
      </div>
    </div>
  );
}
