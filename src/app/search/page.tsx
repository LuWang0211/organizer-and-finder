import Client from "@/app/search/Client";
import { fetchItems } from "@/services/itemService";

export const dynamic = "force-dynamic";

export default async function Page() {
  const items = await fetchItems();

  const initialItems = items.map((item) => ({
    ...item,
    locationName: item.location?.name ?? null,
  }));

  return <Client initialItems={initialItems} />;
}
