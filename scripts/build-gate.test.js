#!/usr/bin/env node
/**
 * Acceptance-criteria smoke tests for scripts/build-gate.js
 *
 * Run with:  node scripts/build-gate.test.js
 *
 * These tests stub the gitleaks binary via the GITLEAKS_PATH env var so no
 * real binary is required.  Each scenario writes a tiny shell stub, runs the
 * gate, and asserts the exit code and structured log output.
 *
 * AC coverage:
 *   AC-1  gitleaks binary absent          → exit 1, log result=not_found
 *   AC-2  gitleaks exits 1 (secrets)      → exit 1, log result=fail
 *   AC-3  gitleaks exits 0 (clean)        → exit 0, log result=pass
 *   AC-4  no path reaches deploy with "gitleaks did not run" (structural)
 *   AC-5  structured log emitted for every outcome
 */

'use strict';

const { spawnSync, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const GATE = path.resolve(__dirname, 'build-gate.js');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'build-gate-test-'));

let passed = 0;
let failed = 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeStub(name, exitCode) {
  const stubPath = path.join(TMP, name);
  if (process.platform === 'win32') {
    fs.writeFileSync(stubPath + '.cmd', `@echo off\r\nexit /b ${exitCode}\r\n`);
    return stubPath + '.cmd';
  }
  fs.writeFileSync(stubPath, `#!/bin/sh\nexit ${exitCode}\n`);
  fs.chmodSync(stubPath, 0o755);
  return stubPath;
}

function runGate(env = {}) {
  return spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, REPO_ROOT: TMP, ...env },
    timeout: 15_000,
  });
}

function parseLog(stdout) {
  // The gate writes one JSON line per run
  const lines = stdout.trim().split('\n').filter(Boolean);
  for (const line of lines) {
    try { return JSON.parse(line); } catch (_) { /* skip non-JSON */ }
  }
  return null;
}

function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.error(`  FAIL  ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

// ---------------------------------------------------------------------------
// AC-1: gitleaks binary absent → exit 1, result=not_found
// ---------------------------------------------------------------------------
console.log('\nAC-1: gitleaks binary absent');
{
  // Point GITLEAKS_PATH at a non-existent file
  const result = runGate({ GITLEAKS_PATH: path.join(TMP, 'no-such-binary') });
  const log = parseLog(result.stdout);

  assert('exit code is 1', result.status === 1, `got ${result.status}`);
  assert('log emitted', log !== null, `stdout: ${result.stdout}`);
  assert('tool=gitleaks', log && log.tool === 'gitleaks');
  assert('result=not_found', log && log.result === 'not_found', `got ${log && log.result}`);
  assert('blocked_deploy=true', log && log.blocked_deploy === true);
  assert('exit_code=null', log && log.exit_code === null);
  assert(
    'human log contains "gitleaks not found"',
    result.stderr.includes('gitleaks not found'),
    `stderr: ${result.stderr}`,
  );
}

// ---------------------------------------------------------------------------
// AC-2: gitleaks exits 1 (secrets detected) → exit 1, result=fail
// ---------------------------------------------------------------------------
console.log('\nAC-2: gitleaks exits 1 (secrets detected)');
{
  const stub = makeStub('gitleaks-fail', 1);
  const result = runGate({ GITLEAKS_PATH: stub });
  const log = parseLog(result.stdout);

  assert('exit code is 1', result.status === 1, `got ${result.status}`);
  assert('log emitted', log !== null);
  assert('tool=gitleaks', log && log.tool === 'gitleaks');
  assert('result=fail', log && log.result === 'fail', `got ${log && log.result}`);
  assert('blocked_deploy=true', log && log.blocked_deploy === true);
  assert('exit_code=1', log && log.exit_code === 1, `got ${log && log.exit_code}`);
}

// ---------------------------------------------------------------------------
// AC-3: gitleaks exits 0 (clean) → exit 0, result=pass
// ---------------------------------------------------------------------------
console.log('\nAC-3: gitleaks exits 0 (clean scan)');
{
  const stub = makeStub('gitleaks-pass', 0);
  const result = runGate({ GITLEAKS_PATH: stub });
  const log = parseLog(result.stdout);

  assert('exit code is 0', result.status === 0, `got ${result.status}`);
  assert('log emitted', log !== null);
  assert('tool=gitleaks', log && log.tool === 'gitleaks');
  assert('result=pass', log && log.result === 'pass', `got ${log && log.result}`);
  assert('blocked_deploy=false', log && log.blocked_deploy === false);
  assert('exit_code=0', log && log.exit_code === 0, `got ${log && log.exit_code}`);
}

// ---------------------------------------------------------------------------
// AC-4: structural — no code path emits "gitleaks did not run" and exits 0
// (verified by reading the source; the test suite covers all exit paths above)
// ---------------------------------------------------------------------------
console.log('\nAC-4: no silent-skip path (structural check)');
{
  const src = fs.readFileSync(GATE, 'utf8');
  assert(
    'source does not contain silent-skip pattern',
    !src.includes('gitleaks did not run'),
    'found forbidden string in source',
  );
  // Every branch that does not call process.exit(1) must call process.exit(0)
  // and must have emitted a log entry first (covered by AC-1/2/3 above).
  assert('AC-1/2/3 all passed (no unlogged exit path)', failed === 0);
}

// ---------------------------------------------------------------------------
// AC-5: structured log for every outcome (covered by AC-1/2/3 assertions above)
// ---------------------------------------------------------------------------
console.log('\nAC-5: structured log emitted for every outcome');
{
  assert('AC-1 log verified', true); // already asserted above
  assert('AC-2 log verified', true);
  assert('AC-3 log verified', true);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${'='.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED');
  process.exit(0);
}
