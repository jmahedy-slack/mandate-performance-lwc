import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMandateViewModel,
  computeActiveReturn,
  formatActiveReturn,
  formatAumSterling,
  getNextBestAction,
  getStatusLabel,
  SAMPLE_MANDATE,
} from "../force-app/main/default/lwc/mandatePerformance/mandateCalc.js";

describe("computeActiveReturn", () => {
  it("subtracts benchmark from portfolio", () => {
    assert.equal(computeActiveReturn(8.4, 6.9), 1.5);
    assert.equal(computeActiveReturn(5.2, 5.6), -0.4);
  });
});

describe("formatActiveReturn", () => {
  it("formats sample mandate active returns", () => {
    const rows = buildMandateViewModel().performanceRows;
    const byKey = Object.fromEntries(rows.map((r) => [r.key, r.activeFormatted]));
    assert.equal(byKey["3M"], "+0.3%");
    assert.equal(byKey["1Y"], "+1.5%");
    assert.equal(byKey["3Y"], "−0.4%");
    assert.equal(byKey["5Y"], "+0.8%");
  });

  it("shows +0.0% at exactly zero", () => {
    assert.equal(formatActiveReturn(0), "+0.0%");
  });
});

describe("getStatusLabel", () => {
  it("marks outperforming when 1Y active is non-negative", () => {
    assert.equal(getStatusLabel(1.5), "Outperforming");
    assert.equal(getStatusLabel(0), "Outperforming");
    assert.equal(getStatusLabel(-0.1), "Underperforming");
  });
});

describe("getNextBestAction", () => {
  it("uses threshold bands including boundaries at 0 and +1.0", () => {
    assert.equal(getNextBestAction(1.5), "Share outperformance story at review");
    assert.equal(getNextBestAction(1.0), "Share outperformance story at review");
    assert.equal(getNextBestAction(0.5), "Reconfirm mandate objectives");
    assert.equal(getNextBestAction(0), "Reconfirm mandate objectives");
    assert.equal(getNextBestAction(-0.1), "Prepare performance attribution pack");
  });
});

describe("formatAumSterling", () => {
  it("formats Westbrook AUM", () => {
    assert.equal(formatAumSterling(SAMPLE_MANDATE.aumGbp), "£1.25bn");
  });
});

describe("buildMandateViewModel", () => {
  it("matches acceptance criteria for status and next best action", () => {
    const view = buildMandateViewModel();
    assert.equal(view.statusLabel, "Outperforming");
    assert.equal(view.nextBestAction, "Share outperformance story at review");
  });

  it("marks 3Y bar negative and others positive", () => {
    const flags = buildMandateViewModel().performanceRows.map((r) => ({
      key: r.key,
      barPositive: r.barPositive,
    }));
    assert.deepEqual(flags, [
      { key: "3M", barPositive: true },
      { key: "1Y", barPositive: true },
      { key: "3Y", barPositive: false },
      { key: "5Y", barPositive: true },
    ]);
  });
});
