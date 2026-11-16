import { ListingForm } from "@/components/ListingForm";
import { Flash, type SP } from "@/components/ui";
export const metadata = { title: "Novo anúncio" };
export default async function Novo({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <><h1 className="page-title">Novo anúncio</h1><Flash sp={sp} /><div style={{ marginTop: 16 }}><ListingForm listing={null} /></div></>;
}
