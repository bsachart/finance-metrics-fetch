import { cleanup, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, it, vi } from "vitest";

import Page from "../../../src/routes/+page.svelte";

// Mock the components that might cause issues during rendering
vi.mock("$charts/price-chart.svelte", () => ({
  default: () => ({}),
}));

const mockDashboardData = {
  constituentsByIndex: {},
  filterMembershipBySymbol: { VOO: ["all"] },
  indexOptions: [],
  marketBySymbol: { VOO: [] },
  status: { finished_at: "2026-05-10T19:00:00Z", status: "success", failed_symbols: [], failed_sources: [] },
  symbolOptions: [{ symbol: "VOO", label: "Vanguard S&P 500 ETF", role: "benchmark", hasMarketData: true }],
  vixSymbol: null,
};

describe("+page.svelte defaults", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it("defaults the selected lookback to 1Y", async () => {
    render(Page, {
      data: {
        dashboard: mockDashboardData,
        defaultSymbol: "VOO",
        warnings: [],
      },
    });

    const oneYearButtons = screen.getAllByText("1Y");
    expect(oneYearButtons[0].className).toContain("bg-accent/70");
    
    const oneMonthButtons = screen.getAllByText("1M");
    // The first 1M is in Timeframe, the second is in Bars
    expect(oneMonthButtons[0].className).not.toContain("bg-accent/70");
  });
});
