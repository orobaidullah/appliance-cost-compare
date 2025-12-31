'use strict';

const fs = require('node:fs');
const { compare } = require('./calc');



function readStdin() {
  return fs.readFileSync(0, 'utf8').trim();
}

function formatMoneyEUR(amount) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatNumber(n, digits = 2) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
}

function main() {
  const raw = readStdin();
  const input = JSON.parse(raw);

  const scenario = {
    electricityPricePerKWh: input.electricityPricePerKWh,
    years: input.years
  };

  const a = input.applianceA;
  const b = input.applianceB;

  const result = compare(a, b, scenario);

  const nameA = a.name ?? 'Appliance A';
  const nameB = b.name ?? 'Appliance B';

  const pretty = {
    scenario,
    applianceA: { name: nameA, ...result.totals.A },
    applianceB: { name: nameB, ...result.totals.B },
    cheaper: result.cheaper === 'A' ? nameA : result.cheaper === 'B' ? nameB : 'equal',
    difference: result.difference
  };

  // Human-readable output
  process.stdout.write(`Scenario: electricity ${formatMoneyEUR(scenario.electricityPricePerKWh)} per kWh, duration ${scenario.years} years\n\n`);

  for (const [label, item] of [
    ['A', pretty.applianceA],
    ['B', pretty.applianceB]
  ]) {
    process.stdout.write(`${label}) ${item.name}\n`);
    process.stdout.write(`   Purchase:       ${formatMoneyEUR(item.purchaseCost)}\n`);
    process.stdout.write(`   kWh per use:    ${formatNumber(item.kWhPerUse)} kWh\n`);
    process.stdout.write(`   kWh per year:   ${formatNumber(item.yearlyKWh)} kWh\n`);
    process.stdout.write(`   Energy / year:  ${formatMoneyEUR(item.yearlyEnergyCost)}\n`);
    process.stdout.write(`   Energy total:   ${formatMoneyEUR(item.totalEnergyCost)}\n`);
    process.stdout.write(`   TOTAL:          ${formatMoneyEUR(item.totalCost)}\n\n`);
  }

  if (result.cheaper === 'equal') {
    process.stdout.write('Result: Both appliances have equal total cost.\n');
  } else {
    const cheaperName = result.cheaper === 'A' ? nameA : nameB;
    process.stdout.write(`Result: Cheaper is ${cheaperName} by ${formatMoneyEUR(result.difference)} over ${scenario.years} years.\n`);
  }

  // Machine-readable JSON (last line) for automation
  process.stdout.write(`\nJSON_RESULT=${JSON.stringify(pretty)}\n`);
}

main();
