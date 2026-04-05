import type { ConstituentRecord } from "./types";

export function filterConstituents(
  records: ConstituentRecord[],
  query: string,
): ConstituentRecord[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return records;
  }

  return records.filter((record) =>
    [record.symbol, record.name, record.sector, record.sub_industry]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
