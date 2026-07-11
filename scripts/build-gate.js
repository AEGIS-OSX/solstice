#!/usr/bin/env node
/**
 * build-gate.js — Garrison gitleaks enforcement gate
 *
 * Exit codes:
 *   0  — gitleaks ran and found no secrets (deploy proceeds)
 *   1  — gitleaks not found, failed to start, or found secrets (deploy blocked)
 *
 * Structured log emitted on every outcome:
 *   { tool: "gitleaks", exit_code: N|null, result: "pass"|"fail"|"not_found", blocked_deploy: true|false }
 *
 * There is NO path where this gate exits 0 without a completed clean scan.
 */

"use strict";

const { spawnSync } = require("child_process");

function emit(exit_code, result, blocked_deploy) {
  const entry = { tool: "gitleaks", exit_code, result, blocked_deploy };
  // Use process.stdout.write so the log line is always emitted even if
  // console has been redirected; CI log collectors read stdout.
  process.stdout.write(JSON.stringify(entry) + "\n");
}

function run() {
  // Step 1: verify the binary is on PATH
  const which = spawnSync("which", ["gitleaks"], { encoding: "utf8" });
  const onWindows = process.platform === "win32";
  const whereCheck = onWindows
    ? spawnSync("where", ["gitleaks"], { encoding: "utf8" })
    : which;

  if (whereCheck.status !== 0 || !whereCheck.stdout.trim()) {
    emit(null, "not_found", true);
    process.stderr.write(
      "[build-gate] gitleaks not found: blocking deploy.\n"
    );
    process.exit(1);
  }

  // Step 2: run the scan
  const scan = spawnSync(
    "gitleaks",
    ["detect", "--source", ".", "--exit-code", "1", "--no-git"],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );

  // spawnSync sets status=null when the binary fails to start (ENOENT etc.)
  if (scan.status === null) {
    emit(null, "not_found", true);
    process.stderr.write(
      "[build-gate] gitleaks failed to start: blocking deploy.\n"
    );
    if (scan.stderr) process.stderr.write(scan.stderr);
    process.exit(1);
  }

  if (scan.status !== 0) {
    emit(scan.status, "fail", true);
    process.stderr.write(
      `[build-gate] gitleaks exited ${scan.status} (secrets detected or scan error): blocking deploy.\n`
    );
    if (scan.stdout) process.stdout.write(scan.stdout);
    if (scan.stderr) process.stderr.write(scan.stderr);
    process.exit(1);
  }

  // Step 3: clean scan
  emit(0, "pass", false);
  process.stdout.write("[build-gate] gitleaks scan clean: deploy proceeds.\n");
  process.exit(0);
}

run();
