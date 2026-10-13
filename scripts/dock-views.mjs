#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const channelId = process.argv[2] || process.env.SLACK_CHANNEL_ID;
if (!channelId) {
  console.error("Usage: node scripts/dock-views.mjs <channel-id>");
  process.exit(1);
}

const token = process.env.SLACK_BOT_TOKEN;
if (!token) {
  console.error("SLACK_BOT_TOKEN required");
  process.exit(1);
}

async function slack(method, payload) {
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

const html = readFileSync(join(ROOT, "Homepage.html"), "utf8");
let diffContent = "";
try {
  diffContent = execSync("git diff main...HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  if (!diffContent) {
    diffContent = execSync("git show HEAD --no-color", { cwd: ROOT, encoding: "utf8" }).trim();
  }
} catch (_) {}

const planBlocks = [
  { type: "header", text: { type: "plain_text", text: "Plan: Mandate Performance LWC" } },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Built*\n• `mandateCalc.js` — active return, status, next-best-action, AUM formatting\n• LWC `mandatePerformance` (Record & App page targets, API 62.0)\n• `Homepage.html` — SLDS-style preview with SVG active-return chart\n• `test/mandateCalc.test.js` — acceptance thresholds",
    },
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Repo:* <https://github.com/jmahedy-slack/mandate-performance-lwc|jmahedy-slack/mandate-performance-lwc>",
    },
  },
];

for (const [label, payload] of [
  ["Homepage", { type: "html", view_key: "homepage.html", name: "Homepage", content: html }],
  ["Plan", { type: "block_kit", view_key: "plan", name: "Plan", blocks: planBlocks }],
]) {
  const res = await slack("agents.conversations.setView", { channel_id: channelId, ...payload });
  console.log(label, res.ok ? "✔" : res.error);
}

if (diffContent) {
  const branch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  const diffRes = await slack("agents.conversations.setView", {
    channel_id: channelId,
    type: "diff",
    content: diffContent,
    base_branch: "main",
    head_branch: branch,
  });
  console.log("Diff", diffRes.ok ? "✔" : diffRes.error);
}
