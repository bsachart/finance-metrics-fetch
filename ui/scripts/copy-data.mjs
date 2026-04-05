import { cp, mkdtemp, mkdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const uiRoot = path.resolve(here, "..");
const repoRoot = path.resolve(uiRoot, "..");
const sourceRoot = path.join(repoRoot, "data");
const configSource = path.join(repoRoot, "config", "tickers.json");
const staticRoot = path.join(uiRoot, "static");
const targetRoot = path.join(uiRoot, "static", "published");

await mkdir(staticRoot, { recursive: true });
const tempRoot = await mkdtemp(path.join(staticRoot, "published-tmp-"));
await cp(sourceRoot, path.join(tempRoot, "data"), { recursive: true });
await cp(configSource, path.join(tempRoot, "tickers.json"));
await rm(targetRoot, { force: true, recursive: true });
await rename(tempRoot, targetRoot);
