import { LightningElement } from "lwc";
import { buildMandateViewModel, BENCHMARK_NAME } from "./mandateCalc.js";

export default class MandatePerformance extends LightningElement {
  benchmarkName = BENCHMARK_NAME;

  get view() {
    return buildMandateViewModel();
  }

  get mandateName() {
    return this.view.name;
  }

  get clientName() {
    return this.view.client;
  }

  get aumFormatted() {
    return this.view.aumFormatted;
  }

  get inception() {
    return this.view.inception;
  }

  get statusLabel() {
    return this.view.statusLabel;
  }

  get statusClass() {
    return this.view.statusOutperforming
      ? "slds-badge slds-theme_success status-chip"
      : "slds-badge slds-theme_error status-chip";
  }

  get performanceRows() {
    return this.view.performanceRows;
  }

  get nextReview() {
    return this.view.nextReview;
  }

  get relationshipManager() {
    return this.view.relationshipManager;
  }

  get nextBestAction() {
    return this.view.nextBestAction;
  }

  get chartBars() {
    const rows = this.view.performanceRows;
    const maxAbs = Math.max(...rows.map((r) => Math.abs(r.active)), 0.1);
    const scale = 40 / maxAbs;
    const baseY = 80;
    const startX = 48;
    const gap = 64;

    return rows.map((row, index) => {
      const height = Math.max(4, Math.abs(row.active) * scale);
      const x = startX + index * gap;
      return {
        key: row.key,
        label: row.label,
        height,
        y: row.barPositive ? baseY - height : baseY,
        x,
        textX: x + 18,
        className: row.barPositive ? "bar bar-positive" : "bar bar-negative",
      };
    });
  }
}
