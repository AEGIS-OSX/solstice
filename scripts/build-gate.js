#!/usr/bin/env node
/**
 * Garrison build-gate: gitleaks secret scan enforcement
 *
 * Exit codes:
 *   0  — gitleaks ran and found no secrets (deploy proceeds)
 *   1  — gitleaks not found, failed to start, or found secrets (deploy blocked)
 *
 * Structured log emitted for every outcome:
 *   { tool: "gitleaks", exit_code: N|null, result: "pass"|"fail"|"not_found", blocked_deploy: true|false }
 *
 * There is NO valid path where the gate passes without a completed scan.
 * The former "gitleaks did not run" silent-skip is treated as a hard failure.
 */

'use strict';

const { spawnSync, execFileSync } = require('child_process');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Emit a structured log entry to stdout (JSON) and a human-readable line to
 * stderr so both machine consumers and human operators see the outcome.
 *
 * @param {object} entry
 * @param {string} entry.tool
 * @param {number|null} entry.exit_code
 * @param {'pass'|'fail'|'not_found'} entry.result
 * @param {boolean} entry.blocked_deploy
 * @param {string} [entry.message]  human-readable detail
 */
function emitLog(entry) {
  // Structured JSON for machine consumers / log aggregators
  process.stdout.write(JSON.stringify(entry) + '\n');
  // Human-readable for CI logs
  const icon = entry.blocked_deploy ? '\u274C' : '\u2705';
  const msg = entry.message || `gitleaks result: ${entry.result}`;
  process.stderr.write(`${icon} [build-gate] ${msg}\n`);
}

/**
 * Resolve the gitleaks binary path.
 * Checks PATH first, then a project-local fallback at .bin/gitleaks.
 *
 * @returns {string|null} absolute path or null if not found
 */
function resolveGitleaks() {
  // 1. Honour an explicit override via env var
  if (process.env.GITLEAKS_PATH) {
    return process.env.GITLEAKS_PATH;
  }

  // 2. Try PATH lookup via `which` / `where`
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    const result = execFileSync(which, ['gitleaks'], { encoding: 'utf8' }).trim();
    if (result) return result.split('\n')[0].trim();
  } catch (_) {
    // not on PATH
  }

  // 3. Project-local fallback
  const local = path.resolve(__dirname, '..', '.bin', 'gitleaks');
  try {
    require('fs').accessSync(local, require('fs').constants.X_OK);
    return local;
  } catch (_) {
    // not present locally
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const repoRoot = process.env.REPO_ROOT || path.resolve(__dirname, '..');
  const configFlag = process.env.GITLEAKS_CONFIG
    ? ['--config', process.env.GITLEAKS_CONFIG]
    : [];

  // ---- 1. Locate the binary -----------------------------------------------
  const binaryPath = resolveGitleaks();

  if (!binaryPath) {
    emitLog({
      tool: 'gitleaks',
      exit_code: null,
      result: 'not_found',
      blocked_deploy: true,
      message: 'gitleaks not found: blocking deploy.',
    });
    // Hard failure — no valid path where the gate passes without a scan
    process.exit(1);
  }

  // ---- 2. Run the scan -----------------------------------------------------
  const args = [
    'detect',
    '--source', repoRoot,
    '--no-git',          // scan working tree; remove if you want git-history scan
    '--exit-code', '1',  // exit 1 on findings (gitleaks default, but explicit)
    '--redact',          // redact secret values from logs
    ...configFlag,
  ];

  let spawnResult;
  try {
    spawnResult = spawnSync(binaryPath, args, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10 MB
      timeout: 120_000,            // 2-minute hard timeout
    });
  } catch (spawnErr) {
    // spawnSync itself threw — binary exists but could not be executed
    emitLog({
      tool: 'gitleaks',
      exit_code: null,
      result: 'fail',
      blocked_deploy: true,
      message: `gitleaks failed to start: ${spawnErr.message}`,
    });
    process.exit(1);
  }

  // ---- 3. Handle spawn-level errors (ENOENT, EACCES, timeout) -------------
  if (spawnResult.error) {
    const isNotFound =
      spawnResult.error.code === 'ENOENT' ||
      spawnResult.error.code === 'EACCES';

    if (isNotFound) {
      emitLog({
        tool: 'gitleaks',
        exit_code: null,
        result: 'not_found',
        blocked_deploy: true,
        message: 'gitleaks not found: blocking deploy.',
      });
    } else {
      emitLog({
        tool: 'gitleaks',
        exit_code: null,
        result: 'fail',
        blocked_deploy: true,
        message: `gitleaks execution error: ${spawnResult.error.message}`,
      });
    }
    process.exit(1);
  }

  // ---- 4. Evaluate the scan exit code -------------------------------------
  const exitCode = spawnResult.status;

  if (exitCode === null) {
    // Process was killed (e.g. timeout signal) — treat as hard failure
    emitLog({
      tool: 'gitleaks',
      exit_code: null,
      result: 'fail',
      blocked_deploy: true,
      message: 'gitleaks was killed before completing (timeout or signal): blocking deploy.',
    });
    process.exit(1);
  }

  if (exitCode === 0) {
    // Clean scan
    emitLog({
      tool: 'gitleaks',
      exit_code: 0,
      result: 'pass',
      blocked_deploy: false,
      message: 'gitleaks scan passed: no secrets detected.',
    });
    process.exit(0);
  }

  // exitCode !== 0: secrets found or scan error
  emitLog({
    tool: 'gitleaks',
    exit_code: exitCode,
    result: 'fail',
    blocked_deploy: true,
    message: `gitleaks exited ${exitCode} (secrets detected or scan error): blocking deploy.`,
  });
  process.exit(1);
}

main();
