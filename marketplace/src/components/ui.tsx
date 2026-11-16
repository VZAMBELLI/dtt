import Link from "next/link";
import { Icon } from "./Icon";
import { TYPES, price, type ListingType } from "@/lib/format";

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".35" />
      <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".6" />
      <circle cx="16" cy="16" r="3" fill="var(--signal)" />
    </svg>
  );
}

export function Verified() {
  return <span className="verified" title="Vendedor verificado"><Icon name="shield" size={14} /><span className="sr">Verificado</span></span>;
}

export function Stars({ value, count }: { value: number; count: number }) {
  if (!count) return null;
  const full = Math.round(value);
  return <span className="stars" aria-label={`${value.toFixed(1)} de 5, ${count} avaliações`}>{"★".repeat(full)}{"☆".repeat(5 - full)}<span>{value.toFixed(1)} ({count})</span></span>;
}

export function Visual({ icon, tag, large }: { icon: string; tag?: string; large?: boolean }) {
  return (
    <div className={`visual${large ? " visual--lg" : ""}`}>
      {tag && <span className="tag">{tag}</span>}
      <Icon name={icon} size={64} />
    </div>
  );
}

type CardListing = {
  slug: string; title: string; type: string; priceCents: number | null; priceUnit: string; requiresQuote: boolean;
  category: { icon: string; name: string }; store: { name: string; verified: boolean };
  reviews?: { rating: number }[];
};
export function ListingCard({ l }: { l: CardListing }) {
  const r = l.reviews ?? [];
  const avg = r.length ? r.reduce((s, x) => s + x.rating, 0) / r.length : 0;
  const p = price(l);
  return (
    <Link href={`/produto/${l.slug}`} className="pcard">
      <Visual icon={l.category.icon} tag={TYPES[l.type as ListingType]?.singular.toUpperCase()} />
      <div className="pcard__body">
        <span className="pcard__type">{l.category.name}</span>
        <h3>{l.title}</h3>
        <span className="pcard__store">{l.store.name} {l.store.verified && <Verified />}</span>
        <Stars value={avg} count={r.length} />
        <span className="pcard__price">{p}</span>
      </div>
    </Link>
  );
}

export function StatusPill({ status, map }: { status: string; map: Record<string, string> }) {
  const tone = ["ACTIVE", "APPROVED", "PAID", "COMPLETED", "ANSWERED", "DELIVERED"].includes(status) ? "ok"
    : ["REJECTED", "CANCELED", "SUSPENDED"].includes(status) ? "bad"
    : ["PENDING", "PENDING_PAYMENT", "OPEN"].includes(status) ? "warn" : "";
  return <span className={`pill${tone ? ` pill--${tone}` : ""}`}>{map[status] ?? status}</span>;
}

export function Flash({ sp }: { sp: Record<string, string | string[] | undefined> }) {
  const erro = typeof sp.erro === "string" ? sp.erro : null;
  return erro ? <p className="alert alert--bad" role="alert">{erro}</p> : null;
}
export type SP = Promise<Record<string, string | string[] | undefined>>;
export const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
