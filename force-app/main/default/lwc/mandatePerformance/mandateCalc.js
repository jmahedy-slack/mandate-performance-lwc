/** Mandate performance calculations — plain ES module (no LWC imports). */

export const BENCHMARK_NAME = "MSCI ACWI";

export const SAMPLE_PERIODS = [
  { key: "3M", label: "3M", portfolio: 2.1, benchmark: 1.8, annualized: false },
  { key: "1Y", label: "1Y", portfolio: 8.4, benchmark: 6.9, annualized: false },
  { key: "3Y", label: "3Y (ann.)", portfolio: 5.2, benchmark: 5.6, annualized: true },
  { key: "5Y", label: "5Y (ann.)", portfolio: 7.1, benchmark: 6.3, annualized: true },
];

export const SAMPLE_MANDATE = {
  name: "Westbrook Pension Fund — Global Equity",
  client: "Westbrook Pension Trustees",
  aumGbp: 1_250_000_000,
  inception: "01/03/2019",
  nextReview: "15/11/2026",
  relationshipManager: "Elena Voss",
  periods: SAMPLE_PERIODS,
};

/**
 * Active return in percentage points (portfolio minus benchmark).
 * @param {number} portfolioPct
 * @param {number} benchmarkPct
 */
export function computeActiveReturn(portfolioPct, benchmarkPct) {
  return Math.round((portfolioPct - benchmarkPct) * 10) / 10;
}

/**
 * @param {number} activePct
 */
export function formatActiveReturn(activePct) {
  const rounded = Math.round(activePct * 10) / 10;
  if (rounded === 0) return "+0.0%";
  const sign = rounded > 0 ? "+" : "−";
  return `${sign}${Math.abs(rounded).toFixed(1)}%`;
}

/** @param {number} oneYearActivePct */
export function getStatusLabel(oneYearActivePct) {
  return oneYearActivePct >= 0 ? "Outperforming" : "Underperforming";
}

/** @param {number} oneYearActivePct */
export function getNextBestAction(oneYearActivePct) {
  if (oneYearActivePct >= 1.0) return "Share outperformance story at review";
  if (oneYearActivePct >= 0) return "Reconfirm mandate objectives";
  return "Prepare performance attribution pack";
}

/** @param {number} amountGbp */
export function formatAumSterling(amountGbp) {
  if (amountGbp >= 1_000_000_000) {
    const bn = amountGbp / 1_000_000_000;
    return `£${bn.toFixed(2)}bn`;
  }
  if (amountGbp >= 1_000_000) {
    const m = amountGbp / 1_000_000;
    return `£${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}m`;
  }
  return `£${amountGbp.toLocaleString("en-GB")}`;
}

/**
 * @param {{ portfolio: number, benchmark: number }[]} periods
 */
export function enrichPeriodRows(periods) {
  return periods.map((row) => {
    const active = computeActiveReturn(row.portfolio, row.benchmark);
    return {
      ...row,
      active,
      activeFormatted: formatActiveReturn(active),
      barPositive: active >= 0,
    };
  });
}

/**
 * @param {typeof SAMPLE_MANDATE} mandate
 */
export function buildMandateViewModel(mandate = SAMPLE_MANDATE) {
  const rows = enrichPeriodRows(mandate.periods);
  const oneYear = rows.find((r) => r.key === "1Y");
  const oneYearActive = oneYear ? oneYear.active : 0;

  return {
    ...mandate,
    aumFormatted: formatAumSterling(mandate.aumGbp),
    statusLabel: getStatusLabel(oneYearActive),
    statusOutperforming: oneYearActive >= 0,
    nextBestAction: getNextBestAction(oneYearActive),
    oneYearActive,
    performanceRows: rows,
  };
}
