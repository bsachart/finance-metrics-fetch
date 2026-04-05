import { getDefaultSymbol, loadDashboardData } from "$data/dashboard";

import type { PageLoad } from "./$types";

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
  const payload = await loadDashboardData(fetch);

  return {
    defaultSymbol: getDefaultSymbol(payload.dashboard),
    ...payload,
  };
};
