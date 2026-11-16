import { db } from "@/lib/db";
import { saveListing } from "@/app/actions";
import { TYPES, type ListingType } from "@/lib/format";

type L = { id: string; title: string; summary: string; description: string; categoryId: string; priceCents: number | null; priceUnit: string; requiresQuote: boolean; stock: number | null; specs: string } | null;

export async function ListingForm({ listing }: { listing: L }) {
  const cats = await db.category.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });
  const groups = Object.keys(TYPES) as ListingType[];
  const specs = listing ? (JSON.parse(listing.specs) as [string, string][]).map(([k, v]) => `${k}: ${v}`).join("\n") : "";
  return (
    <form action={saveListing} className="form card">
      {listing && <input type="hidden" name="id" value={listing.id} />}
      <label className="field"><span>Categoria</span>
        <select id="lf-cat" name="categoryId" defaultValue={listing?.categoryId ?? ""} required>
          <option value="" disabled>Escolha…</option>
          {groups.map(g => <optgroup key={g} label={TYPES[g].label}>{cats.filter(c => c.type === g).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</optgroup>)}
        </select>
      </label>
      <label className="field"><span>Título</span><input id="lf-title" name="title" defaultValue={listing?.title} maxLength={120} required /></label>
      <label className="field"><span>Resumo</span><input id="lf-summary" name="summary" defaultValue={listing?.summary} maxLength={200} required /><small>Uma frase que aparece no topo do anúncio.</small></label>
      <label className="field"><span>Descrição completa</span><textarea id="lf-desc" name="description" rows={6} defaultValue={listing?.description} /></label>
      <div className="form-row">
        <label className="field"><span>Preço (R$)</span><input id="lf-price" name="price" inputMode="decimal" placeholder="Ex.: 1.299,90" defaultValue={listing?.priceCents ? (listing.priceCents / 100).toFixed(2).replace(".", ",") : ""} /><small>Com “sob orçamento”, vira “a partir de”.</small></label>
        <label className="field"><span>Cobrança por</span>
          <select id="lf-unit" name="priceUnit" defaultValue={listing?.priceUnit ?? "un"}>
            {["un", "hora", "dia", "projeto", "mês", "ano", "licença", "usuário"].map(u => <option key={u} value={u}>{u === "un" ? "unidade" : u}</option>)}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label className="field"><span>Estoque</span><input id="lf-stock" name="stock" type="number" min={0} defaultValue={listing?.stock ?? ""} /><small>Só para equipamentos físicos.</small></label>
        <label className="row" style={{ alignSelf: "center", fontSize: 14 }}><input id="lf-quote" type="checkbox" name="requiresQuote" defaultChecked={listing?.requiresQuote} /> Sob orçamento (o cliente solicita uma proposta)</label>
      </div>
      <label className="field"><span>Especificações</span><textarea id="lf-specs" name="specs" rows={5} defaultValue={specs} placeholder={"Uma por linha, no formato Nome: Valor\nResolução: 4K\nGarantia: 2 anos"} /></label>
      <p className="alert alert--info" style={{ margin: 0 }}>Ao salvar, o anúncio vai para a curadoria e fica público após aprovação.</p>
      <button className="btn btn--primary" type="submit">{listing ? "Salvar e enviar para análise" : "Enviar para análise"}</button>
    </form>
  );
}
