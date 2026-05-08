import SearchGame from "@/app/search/SearchGame";
import { fetchItems } from "@/services/itemService";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialItems = await fetchItems();

  return <SearchGame initialItems={initialItems} />;
}
