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
const lockRoot = path.join(staticRoot, ".published-lock");

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function acquireLock() {
  for (;;) {
    try {
      await mkdir(lockRoot);
      return;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EEXIST") {
        await sleep(100);
        continue;
      }
      throw error;
    }
  }
}

await mkdir(staticRoot, { recursive: true });
await acquireLock();

try {
  const tempRoot = await mkdtemp(path.join(staticRoot, "published-tmp-"));
  await cp(sourceRoot, path.join(tempRoot, "data"), { recursive: true });
  await cp(configSource, path.join(tempRoot, "tickers.json"));
  await rm(targetRoot, { force: true, recursive: true });
  await rename(tempRoot, targetRoot);
} finally {
  await rm(lockRoot, { force: true, recursive: true });
}
