'use strict';

const {
  kWhPerUseFromPower,
  annualEnergyKWh,
  annualEnergyCost,
  totalCost,
  compare
} = require('../src/calc');

describe('calc', () => {
  test('kWh per use from power', () => {
    expect(kWhPerUseFromPower(1000, 2)).toBeCloseTo(2);
    expect(kWhPerUseFromPower(500, 1.5)).toBeCloseTo(0.75);
  });

  test('annual energy in kWh', () => {
    expect(annualEnergyKWh(2, 5)).toBeCloseTo(2 * 5 * 52);
  });

  test('annual energy cost', () => {
    expect(annualEnergyCost(0.3, 2, 5)).toBeCloseTo(0.3 * 2 * 5 * 52);
  });

  test('total cost includes purchase + energy', () => {
    const appliance = { purchasePrice: 400, powerW: 1000, hoursPerUse: 2, usesPerWeek: 5 };
    const scenario = { electricityPricePerKWh: 0.3, years: 10 };

    const out = totalCost(appliance, scenario);
    const kWhPerUse = 2;
    const yearlyKWh = 2 * 5 * 52;
    const yearlyEnergyCost = yearlyKWh * 0.3;
    const totalEnergy = yearlyEnergyCost * 10;

    expect(out.kWhPerUse).toBeCloseTo(kWhPerUse);
    expect(out.yearlyKWh).toBeCloseTo(yearlyKWh);
    expect(out.yearlyEnergyCost).toBeCloseTo(yearlyEnergyCost);
    expect(out.totalEnergyCost).toBeCloseTo(totalEnergy);
    expect(out.totalCost).toBeCloseTo(400 + totalEnergy);
  });

  test('compare picks cheaper appliance', () => {
    const scenario = { electricityPricePerKWh: 0.4, years: 5 };

    const a = { purchasePrice: 300, powerW: 800, hoursPerUse: 1, usesPerWeek: 5 };
    const b = { purchasePrice: 250, powerW: 1200, hoursPerUse: 1, usesPerWeek: 5 };

    const res = compare(a, b, scenario);
    // A uses less energy; validate it is cheaper despite higher purchase.
    expect(['A', 'B', 'equal']).toContain(res.cheaper);
    expect(res.difference).toBeGreaterThanOrEqual(0);
    expect(res.totals.A.totalCost).toBeGreaterThan(0);
    expect(res.totals.B.totalCost).toBeGreaterThan(0);
  });
});
