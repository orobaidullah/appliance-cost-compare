'use strict';

const fs = require('node:fs');
const path = require('node:path');

function main() {
  const eslintPath = path.join(process.cwd(), 'reports', 'eslint.json');
  if (!fs.existsSync(eslintPath)) {
    console.log('No reports/eslint.json found. Run: npm run lint');
    process.exit(0);
  }

  const data = JSON.parse(fs.readFileSync(eslintPath, 'utf8'));

  const counts = {};
  const top = [];

  for (const file of data) {
    for (const msg of file.messages) {
      const rule = msg.ruleId ?? 'unknown';
      counts[rule] = (counts[rule] ?? 0) + 1;
      top.push({
        file: file.filePath,
        line: msg.line,
        col: msg.column,
        rule,
        message: msg.message
      });
    }
  }

  const sortedRules = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const md = [];
  md.push('# Bad Smells Summary');
  md.push('');
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push('');
  md.push('This project uses ESLint + plugins (sonarjs, unicorn, import) as an automated smell detector.');
  md.push('');
  md.push('## Rule counts');
  md.push('');
  if (sortedRules.length === 0) {
    md.push('- No lint findings ✅');
  } else {
    for (const [rule, count] of sortedRules) {
      md.push(`- ${rule}: ${count}`);
    }
  }

  md.push('');
  md.push('## First findings (up to 10)');
  md.push('');
  for (const item of top.slice(0, 10)) {
    const rel = path.relative(process.cwd(), item.file);
    md.push(`- ${rel}:${item.line}:${item.col} ${item.rule} — ${item.message}`);
  }

  md.push('');
  md.push('Artifacts:');
  md.push('- reports/eslint.json');

  fs.writeFileSync(path.join(process.cwd(), 'reports', 'smells-summary.md'), md.join('\n'));
  console.log('Bad smells summary written to reports/smells-summary.md');
}

main();
