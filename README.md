# Appliance Cost Compare (Node.js CLI)

This repository contains a small command-line application that compares the total cost of ownership of two domestic appliances (e.g., washing machines) over a given number of years.

It considers:

- electricity price (EUR per kWh)
- usage intensity (uses per week)
- power usage (W) and runtime (hours per use)
- purchase price (EUR)

---

## Install

```bash
npm install
npm ci
```

---

## TASK 1: How to run the application

The CLI reads all inputs as **JSON from STDIN** and prints results to **STDOUT**.

```bash
node.exe src/index.js < docs/sample-input.json
```

### Input fields

| Field                    | Meaning                          |
| ------------------------ | -------------------------------- |
| `electricityPricePerKWh` | Electricity price in EUR per kWh |
| `years`                  | Time horizon (years)             |
| `purchasePrice`          | Appliance buy price in EUR       |
| `powerW`                 | Power usage in Watts             |
| `hoursPerUse`            | Duration per use (hours)         |
| `usesPerWeek`            | Uses per week                    |

---

## Task 2: Automation & quality tools

These runs:

- ESLint (smells)
- Jest unit tests + coverage
- Metrics computation (SLOC + complexity)
- Smell summary generation
- Mutation testing (Stryker)

### One-by-one commands

```bash
npm run lint
npm test
npm run test:coverage
npm run metrics
npm run smells
npm run mutation
```

### Output artifacts

All outputs are written to `reports/`:

- `reports/coverage/` (Jest coverage)
- `reports/mutation/` (Stryker HTML report)
- `reports/sloc.json`
- `reports/complexity.json`
- `reports/metrics-summary.md`
- `reports/eslint.json`
- `reports/smells-summary.md`

---

## Continuous Integration (CI)

A GitHub Actions workflow is included at:

- `.github/workflows/ci.yml`

It runs the same steps on every push and PR and uploads the `reports/` directory as a build artifact.
