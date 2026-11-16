export const TYPES = {
  PHYSICAL: { label: "Equipamentos", singular: "Equipamento", desc: "Câmeras, controle de acesso, rastreadores, cofres e mais" },
  SERVICE: { label: "Serviços", singular: "Serviço", desc: "Red Team, pentest, proteção executiva e consultoria" },
  DIGITAL: { label: "Digitais", singular: "Produto digital", desc: "Softwares, licenças, cursos e treinamentos" },
  PROFESSIONAL: { label: "Profissionais", singular: "Profissional", desc: "Especialistas independentes verificados" }
} as const;
export type ListingType = keyof typeof TYPES;
export const TYPE_KEYS = Object.keys(TYPES) as ListingType[];

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const money = (cents: number) => brl.format(cents / 100);

export function price(l: { priceCents: number | null; priceUnit: string; requiresQuote: boolean }) {
  if (l.requiresQuote || l.priceCents == null) return l.priceCents ? `a partir de ${money(l.priceCents)}` : "Sob orçamento";
  return l.priceUnit === "un" ? money(l.priceCents) : `${money(l.priceCents)} / ${l.priceUnit}`;
}

export const ORDER_STATUS: Record<string, string> = {
  PENDING_PAYMENT: "Aguardando pagamento",
  PAID: "Pago",
  SHIPPED: "Enviado",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado"
};
export const LISTING_STATUS: Record<string, string> = {
  DRAFT: "Rascunho", PENDING: "Em análise", ACTIVE: "Publicado", REJECTED: "Recusado"
};
export const STORE_STATUS: Record<string, string> = {
  PENDING: "Em análise", APPROVED: "Aprovada", REJECTED: "Recusada", SUSPENDED: "Suspensa"
};

export function slugify(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}
export const date = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

export function parseSpecs(json: string): [string, string][] {
  try { const v = JSON.parse(json); return Array.isArray(v) ? v : []; } catch { return []; }
}
