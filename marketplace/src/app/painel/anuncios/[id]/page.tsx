import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireSeller } from "@/lib/auth";
import { ListingForm } from "@/components/ListingForm";
import { Flash, type SP } from "@/components/ui";
export default async function Editar({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SP }) {
  const { id } = await params; const sp = await searchParams;
  const { store } = await requireSeller();
  const l = await db.listing.findFirst({ where: { id, storeId: store.id } });
  if (!l) notFound();
  return <><h1 className="page-title">Editar anúncio</h1><Flash sp={sp} />{l.rejectReason && <p className="alert alert--bad">Motivo da recusa: {l.rejectReason}</p>}<div style={{ marginTop: 16 }}><ListingForm listing={l} /></div></>;
}
