export interface PublishedTicker {
  symbol: string;
  label: string;
  enabled: boolean;
  role: string;
  source: string;
}

export interface PublishedIndexConfig {
  key: string;
  label: string;
  enabled: boolean;
  source: string;
}

export interface TickerConfig {
  tickers: PublishedTicker[];
  indices: PublishedIndexConfig[];
}

export interface PublishedSymbolAsset {
  symbol: string;
  label: string;
  role: string;
  enabled: boolean;
  has_market_data: boolean;
}

export interface PublishedIndexAsset {
  key: string;
  label: string;
  enabled: boolean;
  has_constituents: boolean;
}

export interface AssetManifest {
  symbols: PublishedSymbolAsset[];
  indices: PublishedIndexAsset[];
}

export interface PublishedStatus {
  started_at: string;
  finished_at: string;
  status: string;
  refreshed_symbols: string[];
  failed_symbols: string[];
  failed_sources: string[];
  messages: string[];
}

export interface MarketPoint {
  date: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  quote_volume: number;
}

export interface ConstituentRecord {
  index_name: string;
  symbol: string;
  name: string;
  sector: string;
  sub_industry: string;
  source_url: string;
}

export interface SymbolOption {
  symbol: string;
  label: string;
  role: string;
  hasMarketData: boolean;
}

export type TickerFilterKey = "all" | "sp500" | "nasdaq100";

export interface TickerFilterOption {
  key: TickerFilterKey;
  label: string;
  symbolCount: number;
}

export interface TickerListEntry {
  symbol: string;
  label: string;
  role: string;
  filterKeys: TickerFilterKey[];
  isActive: boolean;
  isRecent: boolean;
  lastClose: number | null;
  lastChange: number | null;
  lastChangePercent: number | null;
  trendPoints: number[];
  trendDirection: "up" | "down" | "flat" | "none";
}

export interface TickerDiscoveryState {
  activeFilter: TickerFilterKey;
  entries: TickerListEntry[];
  filterOptions: TickerFilterOption[];
  recentEntries: TickerListEntry[];
}

export interface IndexOption {
  key: string;
  label: string;
  hasConstituents: boolean;
}

export type DashboardSection = "tickers" | "constituents";

export interface HistogramBucket {
  start: number;
  end: number;
  count: number;
}

export interface ChartHudState {
  source: "latest" | "hover";
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number | null;
  changePercent: number | null;
  quoteVolume: number;
  vix: number | null;
}

export interface DashboardData {
  status: PublishedStatus;
  symbolOptions: SymbolOption[];
  indexOptions: IndexOption[];
  marketBySymbol: Record<string, MarketPoint[]>;
  vixSymbol: string | null;
  constituentsByIndex: Record<string, ConstituentRecord[]>;
  filterMembershipBySymbol: Record<string, TickerFilterKey[]>;
}
