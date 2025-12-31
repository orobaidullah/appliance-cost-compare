# Demonstration Video Script (Suggested)

Record a short screen capture (3–6 minutes) showing:

## Part A — Successful run

1. **Open terminal** in the project folder.
2. Show the input file:
   ```bash
   cat docs/sample-input.json
   ```
3. Run the CLI:
   ```bash
   cat docs/sample-input.json | node src/index.js
   ```
4. Point out the printed total costs and the cheaper device.

---

## Part B — Successful build + artifacts

1. Run the full pipeline:
   ```bash
   npm ci
   npm run ci
   ```
2. Show generated artifacts:
   ```bash
   ls -la reports
   ```
3. Open at least one HTML report in a browser (optional):
   - `reports/mutation/index.html`

---

## Part C — Version control + breaking change

1. Initialize git (if not already):
   ```bash
   git init
   git add .
   git commit -m "initial working version"
   ```
2. Introduce a breaking change (example): in `src/calc.js`, change this line:
   ```js
   return (powerW / 1000) * hoursPerUse;
   ```
   to something wrong like:
   ```js
   return (powerW) * hoursPerUse;
   ```
3. Re-run tests (should fail):
   ```bash
   npm test
   ```
4. Commit the breaking change:
   ```bash
   git add src/calc.js
   git commit -m "introduce bug (demo)"
   ```
5. (Optional) explain that CI would now fail on GitHub because tests/mutation tests catch the regression.

---

## Part D — CI pipeline

1. Push to GitHub (or show repository page).
2. Open the **Actions** tab and show the successful run for the first commit.
3. Show the failing run for the breaking-change commit.

