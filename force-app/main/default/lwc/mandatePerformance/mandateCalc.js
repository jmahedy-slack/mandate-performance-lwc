/**
 * Pure calculation helpers for mandate performance (no LWC imports).
 */

export const SAMPLE_PERIODS = [
  { key: "3M", label: "3M", portfolio: 2.1, benchmark: 1.8, annualized: false },
  { key: "1Y", label: "1Y", portfolio: 8.4, benchmark: 6.9, annualized: false },
  { key: "3Y", label: "3Y (ann.)", portfolio: 5.2, benchmark: 5.6, annualized: true },
  { key: "5Y", label: "5Y (ann.)", portfolio: 7.1, benchmark: 6.3, annualized: true },
];

export const SAMPLE_MANDATE = {
  name: "Westbrook Pension Fund — Global Equity",
  client: "Westbrook Pension Trustees",
  aumPounds: 1_250_000_000,
  inception: "01/03/2019",
  benchmarkName: "MSCI ACWI",
  nextReviewDate: "15/11/2026",
  relationshipManager: "Elena Voss",
};

export function calcActive(portfolioPct, benchmarkPct) {
  return Math.round((portfolioPct - benchmarkPct) * 10) / 10;
}

export function formatActive(active) {
  const rounded = Math.round(active * 10) / 10;
  const sign = rounded >= 0 ? "+" : "−";
  return `${sign}${Math.abs(rounded).toFixed(1)}%`;
}

export function getPerformanceStatus(oneYearActive) {
  return oneYearActive >= 0 ? "Outperforming" : "Underperforming";
}

export function getNextBestAction(oneYearActive) {
  if (oneYearActive >= 1.0) {
    return "Share outperformance story at review";
  }
  if (oneYearActive >= 0) {
    return "Reconfirm mandate objectives";
  }
  return "Prepare performance attribution pack";
}

export function formatAum(pounds) {
  if (pounds >= 1_000_000_000) {
    const billions = pounds / 1_000_000_000;
    const text = billions.toFixed(2).replace(/\.?0+$/, "");
    return `£${text}bn`;
  }
  if (pounds >= 1_000_000) {
    const millions = pounds / 1_000_000;
    const text = millions.toFixed(2).replace(/\.?0+$/, "");
    return `£${text}m`;
  }
  return `£${pounds.toLocaleString("en-GB")}`;
}

export function enrichPeriods(periods) {
  return periods.map((row) => {
    const active = calcActive(row.portfolio, row.benchmark);
    return {
      ...row,
      active,
      activeFormatted: formatActive(active),
      barColor: active >= 0 ? "positive" : "negative",
      activeCellClass: active >= 0 ? "active-positive" : "active-negative",
    };
  });
}

export function oneYearActiveFromPeriods(enrichedPeriods) {
  const oneYear = enrichedPeriods.find((p) => p.key === "1Y");
  return oneYear ? oneYear.active : 0;
}
