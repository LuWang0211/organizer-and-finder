import Fuse from "fuse.js";
import type { ItemType } from "./itemService";

const fuseOptions = {
  threshold: 0.3,
  minMatchCharLength: 2,
  keys: ["name"],
};

export function createItemSearcher(items: ItemType[]) {
  const fuse = new Fuse(items, fuseOptions);

  return (query: string): { results: ItemType[]; found: boolean } => {
    if (!query.trim()) {
      return { results: items, found: true };
    }

    const results = fuse.search(query);
    const foundItems = results.map((result) => result.item);

    return {
      results: foundItems,
      found: foundItems.length > 0,
    };
  };
}
