'use strict';

const fs = require('node:fs');
const path = require('node:path');
const sloc = require('sloc');
const escomplex = require('typhonjs-escomplex');

function listJsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsFiles(p));
    if (entry.isFile() && p.endsWith('.js')) out.push(p);
  }
  return out;
}

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function ensureReportsDir() {
  const dir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(dir, { recursive: true });
}

function computeSloc(files) {
  const byFile = {};
  const total = { source: 0, comment: 0, empty: 0, total: 0 };

  for (const f of files) {
    const s = readFile(f);
    const r = sloc(s, 'js');
    byFile[path.relative(process.cwd(), f)] = r;
    total.source += r.source;
    total.comment += r.comment;
    total.empty += r.empty;
    total.total += r.total;
  }

  return { total, byFile };
}

function computeComplexity(moduleFiles) {
  const out = {};
  for (const f of moduleFiles) {
    const s = readFile(f);
    // typhonjs-escomplex supports analyzing module source.
    const report = escomplex.analyzeModule(s, { filePath: f });
    out[path.relative(process.cwd(), f)] = {
      aggregate: report.aggregate,
      methods: report.methods?.map(m => ({ name: m.name, cyclomatic: m.cyclomatic })) ?? []
    };
  }
  return out;
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(process.cwd(), file), JSON.stringify(data, null, 2));
}

function writeMarkdown(file, content) {
  fs.writeFileSync(path.join(process.cwd(), file), content);
}

function main() {
  ensureReportsDir();

  const allFiles = [
    ...listJsFiles(path.join(process.cwd(), 'src')),
    ...listJsFiles(path.join(process.cwd(), 'test')),
    ...listJsFiles(path.join(process.cwd(), 'scripts'))
  ];

  const slocReport = computeSloc(allFiles);
  writeJson('reports/sloc.json', slocReport);

  const complexityReport = computeComplexity(listJsFiles(path.join(process.cwd(), 'src')));
  writeJson('reports/complexity.json', complexityReport);

  const md = [
    '# Metrics Summary',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## SLOC (JavaScript)',
    '',
    `- Total lines: ${slocReport.total.total}`,
    `- Source lines: ${slocReport.total.source}`,
    `- Comment lines: ${slocReport.total.comment}`,
    `- Empty lines: ${slocReport.total.empty}`,
    '',
    '## Complexity (typhonjs-escomplex)',
    ''
  ];

  for (const [file, rep] of Object.entries(complexityReport)) {
    md.push(`- ${file}: cyclomatic=${rep.aggregate?.cyclomatic ?? 'n/a'}, maintainability=${rep.aggregate?.maintainability ?? 'n/a'}`);
  }

  md.push('', 'Artifacts:', '- reports/sloc.json', '- reports/complexity.json');
  writeMarkdown('reports/metrics-summary.md', md.join('\n'));

  console.log('Metrics written to reports/');
}

main();
