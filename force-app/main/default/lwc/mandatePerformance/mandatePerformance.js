import { LightningElement } from "lwc";
import {
  SAMPLE_MANDATE,
  SAMPLE_PERIODS,
  enrichPeriods,
  formatAum,
  getNextBestAction,
  getPerformanceStatus,
  oneYearActiveFromPeriods,
} from "./mandateCalc.js";

export default class MandatePerformance extends LightningElement {
  mandate = SAMPLE_MANDATE;
  periods = enrichPeriods(SAMPLE_PERIODS);

  get mandateName() {
    return this.mandate.name;
  }

  get clientName() {
    return this.mandate.client;
  }

  get aumDisplay() {
    return formatAum(this.mandate.aumPounds);
  }

  get inceptionDate() {
    return this.mandate.inception;
  }

  get benchmarkLabel() {
    return this.mandate.benchmarkName;
  }

  get nextReviewDate() {
    return this.mandate.nextReviewDate;
  }

  get relationshipManager() {
    return this.mandate.relationshipManager;
  }

  get oneYearActive() {
    return oneYearActiveFromPeriods(this.periods);
  }

  get statusLabel() {
    return getPerformanceStatus(this.oneYearActive);
  }

  get statusClass() {
    const base = "status-chip slds-badge ";
    return base + (this.oneYearActive >= 0 ? "status-outperforming" : "status-underperforming");
  }

  get nextBestAction() {
    return getNextBestAction(this.oneYearActive);
  }

  get chartBars() {
    const maxAbs = Math.max(...this.periods.map((p) => Math.abs(p.active)), 0.1);
    const scale = 40 / maxAbs;
    const baseX = 44;
    const step = 76;
    return this.periods.map((p, index) => {
      const height = Math.abs(p.active) * scale;
      const isPositive = p.active >= 0;
      const x = baseX + index * step;
      return {
        key: p.key,
        label: p.label,
        height,
        x,
        textX: x + 24,
        y: isPositive ? 50 - height : 50,
        fill: isPositive ? "#2e844a" : "#c23934",
        activeFormatted: p.activeFormatted,
      };
    });
  }
}
