# Mandate Performance Record Page (Salesforce LWC)

Salesforce DX source (API 62.0) for a Lightning record page showing institutional mandate performance vs benchmark. Includes a Slack Code `Homepage.html` preview with SLDS styling.

## Structure

- `force-app/main/default/lwc/mandatePerformance/` — LWC bundle and shared `mandateCalc.js`
- `Homepage.html` — self-contained preview (imports `mandateCalc.js`)
- `test/mandateCalc.test.js` — unit tests

## Commands

```bash
npm test
```

Source only — no org deployment in this repo.
