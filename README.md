# Mandate Performance Record Page (Salesforce LWC)

Salesforce DX source (API 62.0) for an institutional mandate performance record page: portfolio vs MSCI ACWI benchmark, active return chart, and RM sidebar actions.

## Contents

- `force-app/main/default/lwc/mandatePerformance/` — LWC exposed to **Record** and **App** pages
- `mandateCalc.js` — pure ES module (no LWC imports) shared by the component and unit tests
- `Homepage.html` — self-contained SLDS-style preview for Slack Code
- `tests/mandateCalc.test.js` — Node test runner coverage for calculations

## Local checks

```bash
npm test
```

No org deployment is required; this repository is source-only.

## Sample acceptance values

| Period | Active |
|--------|--------|
| 3M | +0.3% |
| 1Y | +1.5% |
| 3Y | −0.4% |
| 5Y | +0.8% |

Status: **Outperforming** · Next best action: **Share outperformance story at review**
