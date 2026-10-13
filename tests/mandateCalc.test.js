import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SAMPLE_MANDATE,
  SAMPLE_PERIODS,
  calcActive,
  enrichPeriods,
  formatActive,
  formatAum,
  getNextBestAction,
  getPerformanceStatus,
} from "../force-app/main/default/lwc/mandatePerformance/mandateCalc.js";

describe("mandateCalc", () => {
  it("computes active returns for sample periods", () => {
    const enriched = enrichPeriods(SAMPLE_PERIODS);
    assert.equal(formatActive(enriched[0].active), "+0.3%");
    assert.equal(formatActive(enriched[1].active), "+1.5%");
    assert.equal(formatActive(enriched[2].active), "−0.4%");
    assert.equal(formatActive(enriched[3].active), "+0.8%");
  });

  it("calcActive matches portfolio minus benchmark", () => {
    assert.equal(calcActive(8.4, 6.9), 1.5);
    assert.equal(calcActive(5.2, 5.6), -0.4);
  });

  it("status chip uses 1Y active", () => {
    const oneYearActive = calcActive(8.4, 6.9);
    assert.equal(getPerformanceStatus(oneYearActive), "Outperforming");
    assert.equal(getPerformanceStatus(-0.1), "Underperforming");
    assert.equal(getPerformanceStatus(0), "Outperforming");
  });

  it("next best action thresholds including 0 and +1.0", () => {
    assert.equal(getNextBestAction(1.5), "Share outperformance story at review");
    assert.equal(getNextBestAction(1.0), "Share outperformance story at review");
    assert.equal(getNextBestAction(0.9), "Reconfirm mandate objectives");
    assert.equal(getNextBestAction(0), "Reconfirm mandate objectives");
    assert.equal(getNextBestAction(-0.1), "Prepare performance attribution pack");
  });

  it("formats AUM as £1.25bn", () => {
    assert.equal(formatAum(SAMPLE_MANDATE.aumPounds), "£1.25bn");
  });

  it("bar colors: 3Y negative, others positive", () => {
    const enriched = enrichPeriods(SAMPLE_PERIODS);
    assert.equal(enriched.find((p) => p.key === "3Y").barColor, "negative");
    for (const key of ["3M", "1Y", "5Y"]) {
      assert.equal(enriched.find((p) => p.key === key).barColor, "positive");
    }
  });
});
