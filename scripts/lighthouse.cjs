#!/usr/bin/env node

const { execSync, spawn } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const THRESHOLD = 90;

function main() {
  console.log("Building site...");
  execSync("npm run build", { cwd: ROOT, stdio: "pipe" });

  console.log("Starting preview server...");
  const server = spawn("npx", ["astro", "preview", "--port", "4322"], {
    cwd: ROOT,
    stdio: "pipe",
  });

  let serverReady = false;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (!serverReady) {
        console.log("Server did not start in time, running Lighthouse anyway...");
        runLighthouse(server, resolve);
      }
    }, 8000);

    server.stdout.on("data", (data) => {
      const output = data.toString();
      if (output.includes("localhost") || output.includes("4322")) {
        if (!serverReady) {
          serverReady = true;
          clearTimeout(timeout);
          setTimeout(() => runLighthouse(server, resolve), 1000);
        }
      }
    });

    server.stderr.on("data", (data) => {
      const output = data.toString();
      if (output.includes("localhost") || output.includes("4322")) {
        if (!serverReady) {
          serverReady = true;
          clearTimeout(timeout);
          setTimeout(() => runLighthouse(server, resolve), 1000);
        }
      }
    });
  });
}

function runLighthouse(server, resolve) {
  console.log("Running Lighthouse audit...");
  try {
    const result = execSync(
      'npx lighthouse http://localhost:4322 --output=json --chrome-flags="--headless --no-sandbox" --only-categories=performance --quiet',
      { cwd: ROOT, stdio: "pipe", timeout: 60000 },
    );
    const report = JSON.parse(result.toString());
    const score = Math.round(report.categories.performance.score * 100);
    console.log(`Performance score: ${score}/100 (threshold: ${THRESHOLD})`);

    server.kill();
    if (score >= THRESHOLD) {
      console.log("PASS");
      resolve(0);
    } else {
      console.log(`FAIL: score ${score} is below threshold ${THRESHOLD}`);
      resolve(1);
    }
  } catch (err) {
    console.error("Lighthouse failed:", err.message?.slice(0, 200));
    server.kill();
    resolve(1);
  }
}

main().then((code) => process.exit(code));
