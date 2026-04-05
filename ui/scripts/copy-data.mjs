import { cp, mkdtemp, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
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

async function buildAssetManifest() {
  const config = JSON.parse(await readFile(configSource, "utf8"));
  const configuredTickers = Array.isArray(config.tickers) ? config.tickers : [];
  const configuredIndices = Array.isArray(config.indices) ? config.indices : [];
  const marketRoot = path.join(sourceRoot, "market");
  const constituentsRoot = path.join(sourceRoot, "constituents");

  const marketFiles = await readdir(marketRoot);
  const constituentFiles = (await readdir(constituentsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".csv"))
    .map((entry) => entry.name);

  const marketSymbols = marketFiles
    .filter((file) => file.endsWith(".csv"))
    .map((file) => path.basename(file, ".csv"));
  const constituentKeys = constituentFiles.map((file) => path.basename(file, ".csv"));

  const symbolMap = new Map();
  for (const ticker of configuredTickers) {
    symbolMap.set(ticker.symbol, {
      symbol: ticker.symbol,
      label: ticker.label,
      role: ticker.role,
      enabled: ticker.enabled !== false,
      has_market_data: marketSymbols.includes(ticker.symbol),
    });
  }
  for (const symbol of marketSymbols) {
    if (!symbolMap.has(symbol)) {
      symbolMap.set(symbol, {
        symbol,
        label: symbol,
        role: "asset",
        enabled: true,
        has_market_data: true,
      });
    }
  }

  const indexMap = new Map();
  for (const index of configuredIndices) {
    indexMap.set(index.key, {
      key: index.key,
      label: index.label,
      enabled: index.enabled !== false,
      has_constituents: constituentKeys.includes(index.key),
    });
  }
  for (const key of constituentKeys) {
    if (!indexMap.has(key)) {
      indexMap.set(key, {
        key,
        label: key,
        enabled: true,
        has_constituents: true,
      });
    }
  }

  return {
    indices: Array.from(indexMap.values()).sort((left, right) =>
      left.label.localeCompare(right.label),
    ),
    symbols: Array.from(symbolMap.values()).sort((left, right) =>
      left.symbol.localeCompare(right.symbol),
    ),
  };
}

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
  await writeFile(
    path.join(tempRoot, "asset-manifest.json"),
    JSON.stringify(await buildAssetManifest(), null, 2),
  );
  await rm(targetRoot, { force: true, recursive: true });
  await rename(tempRoot, targetRoot);
} finally {
  await rm(lockRoot, { force: true, recursive: true });
}
