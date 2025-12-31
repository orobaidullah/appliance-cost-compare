# Bad Smells Summary

Generated: 2025-12-31T01:12:19.910Z

This project uses ESLint + plugins (sonarjs, unicorn, import) as an automated smell detector.

## Rule counts

- no-undef: 27
- complexity: 1

## First findings (up to 10)

- scripts\metrics.js:23:25 no-undef — 'process' is not defined.
- scripts\metrics.js:34:26 no-undef — 'process' is not defined.
- scripts\metrics.js:50:23 no-undef — 'process' is not defined.
- scripts\metrics.js:59:30 no-undef — 'process' is not defined.
- scripts\metrics.js:63:30 no-undef — 'process' is not defined.
- scripts\metrics.js:70:30 no-undef — 'process' is not defined.
- scripts\metrics.js:71:30 no-undef — 'process' is not defined.
- scripts\metrics.js:72:30 no-undef — 'process' is not defined.
- scripts\metrics.js:78:68 no-undef — 'process' is not defined.
- scripts\metrics.js:104:3 no-undef — 'console' is not defined.

Artifacts:
- reports/eslint.json