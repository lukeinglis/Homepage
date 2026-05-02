#!/usr/bin/env node

// Eval scorer for personal-website
// Runs each dimension and outputs a JSON score object

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");

function runCommand(cmd, cwd = ROOT) {
  try {
    execSync(cmd, { cwd, stdio: "pipe", timeout: 120000 });
    return { pass: true, error: null };
  } catch (err) {
    return { pass: false, error: err.stderr?.toString().slice(0, 500) || err.message };
  }
}

function checkDayConfigs() {
  const configDir = path.join(ROOT, "src", "config", "days");
  const requiredDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const requiredFields = ["theme", "greeting", "widgets", "quickLinks"];

  if (!fs.existsSync(configDir)) {
    return { pass: false, error: `Config directory not found: ${configDir}` };
  }

  const missing = [];
  const incomplete = [];

  for (const day of requiredDays) {
    const tsFile = path.join(configDir, `${day}.ts`);
    const jsFile = path.join(configDir, `${day}.js`);

    if (!fs.existsSync(tsFile) && !fs.existsSync(jsFile)) {
      missing.push(day);
      continue;
    }

    const content = fs.readFileSync(fs.existsSync(tsFile) ? tsFile : jsFile, "utf8");
    for (const field of requiredFields) {
      if (!content.includes(field)) {
        incomplete.push(`${day}: missing '${field}'`);
      }
    }
  }

  if (missing.length > 0 || incomplete.length > 0) {
    const errors = [];
    if (missing.length) errors.push(`Missing configs: ${missing.join(", ")}`);
    if (incomplete.length) errors.push(`Incomplete: ${incomplete.join("; ")}`);
    return { pass: false, error: errors.join(". ") };
  }

  return { pass: true, error: null };
}

function main() {
  const dimensions = [
    { id: "build", weight: 0.20, run: () => runCommand("npm run build") },
    { id: "tests", weight: 0.25, run: () => runCommand("npm test") },
    { id: "lint", weight: 0.15, run: () => runCommand("npm run lint") },
    { id: "day_configs", weight: 0.15, run: () => checkDayConfigs() },
    { id: "widget_isolation", weight: 0.15, run: () => runCommand("npm run test:isolation") },
    { id: "lighthouse", weight: 0.10, run: () => runCommand("npm run lighthouse") },
  ];

  const results = {};
  let totalScore = 0;

  for (const dim of dimensions) {
    const result = dim.run();
    const score = result.pass ? 1.0 : 0.0;
    totalScore += score * dim.weight;
    results[dim.id] = {
      score,
      weight: dim.weight,
      weighted: score * dim.weight,
      pass: result.pass,
      error: result.error,
    };
  }

  const output = {
    total_score: Math.round(totalScore * 1000) / 1000,
    threshold: 0.8,
    pass: totalScore >= 0.8,
    dimensions: results,
  };

  console.log(JSON.stringify(output, null, 2));
  process.exit(output.pass ? 0 : 1);
}

main();
