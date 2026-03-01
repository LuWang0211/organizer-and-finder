import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chokidar from "chokidar";
import {
  isUIStylePageMeta,
  type UIStylePageMeta,
} from "../src/app/ui_style/common";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_STYLE_DIR = path.join(__dirname, "../src/app/ui_style");
const NAV_ITEMS_OUTPUT = path.join(UI_STYLE_DIR, "navItems.ts");

const log = (message: string) =>
  console.log(`[UI Style Generator]: ${message}`);

interface PageMeta {
  route: string;
  href: string;
  title: string;
  navLabel: string;
}

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function findUIStyleMetaExport(
  module: Record<string, unknown>,
): UIStylePageMeta | null {
  for (const key of Object.keys(module)) {
    const value = module[key];
    if (isUIStylePageMeta(value)) {
      return value;
    }
  }
  return null;
}

async function extractMeta(filePath: string): Promise<UIStylePageMeta> {
  try {
    const module = await import(`${filePath}?t=${Date.now()}`);

    const meta = findUIStyleMetaExport(module as Record<string, unknown>);
    if (meta) {
      return {
        title: meta.title,
        navLabel: meta.navLabel ?? "",
      };
    }
  } catch {
    // Fallback to regex if import fails
  }

  const dirName = path.basename(path.dirname(filePath));
  return {
    title: slugToTitle(dirName),
    navLabel: "",
  };
}

async function scanPages(): Promise<PageMeta[]> {
  const pages: PageMeta[] = [];

  async function scanDir(dir: string, baseRoute: string = "/ui_style") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const pagePath = path.join(fullPath, "page.tsx");
        if (fs.existsSync(pagePath)) {
          const route = baseRoute ? `${baseRoute}/${entry.name}` : entry.name;
          const meta = await extractMeta(pagePath);
          pages.push({
            route,
            href: route,
            title: meta.navLabel || meta.title,
            navLabel: meta.navLabel ?? "",
          });
        } else {
          const newBaseRoute = baseRoute
            ? `${baseRoute}/${entry.name}`
            : entry.name;
          await scanDir(fullPath, newBaseRoute);
        }
      }
    }
  }

  await scanDir(UI_STYLE_DIR);
  return pages;
}

async function generate() {
  const pages = await scanPages();

  if (pages.length === 0) {
    log("No pages found.");
    return;
  }

  log(`Found ${pages.length} pages:`);
  pages.forEach((p) => log(`  - ${p.route}: ${p.title}`));

  const navItems = pages.map((p) => ({
    title: p.title,
    href: p.href,
  }));

  const navItemsContent = `export const navItems = ${JSON.stringify(navItems, null, 2)} as const;`;

  fs.writeFileSync(NAV_ITEMS_OUTPUT, navItemsContent);
  log(`Generated: ${NAV_ITEMS_OUTPUT}`);
}

async function watch() {
  log(`Watching ${UI_STYLE_DIR} for changes...`);

  let timeout: NodeJS.Timeout;

  const triggerRegenerate = (filePath: string) => {
    log(`\nFile changed: ${path.relative(UI_STYLE_DIR, filePath)}`);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      generate();
    }, 100);
  };

  const onFileChange = (event: string) => (filePath: string) => {
    if (filePath.endsWith("page.tsx")) {
      log(`[watcher] ${event}: ${filePath}`);
      triggerRegenerate(filePath);
    }
  };

  chokidar
    .watch(UI_STYLE_DIR, {
      persistent: true,
      ignoreInitial: true,
      depth: 10,
    })
    .on("add", onFileChange("add"))
    .on("change", onFileChange("change"))
    .on("unlink", onFileChange("unlink"));
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--watch") || args.includes("-w")) {
    await generate();
    await watch();
    // Keep process alive
    await new Promise(() => {});
  } else {
    await generate();
  }
}

main();
