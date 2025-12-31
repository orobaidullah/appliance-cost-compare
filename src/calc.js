"use strict";

/**
 * Compute kWh per single use from power (W) and duration (hours).
 * @param {number} powerW
 * @param {number} hoursPerUse
 * @returns {number}
 */
function kWhPerUseFromPower(powerW, hoursPerUse) {
  return (powerW / 1000) * hoursPerUse;
}

/**
 * Annual energy usage in kWh.
 * @param {number} kWhPerUse
 * @param {number} usesPerWeek
 * @returns {number}
 */
function annualEnergyKWh(kWhPerUse, usesPerWeek) {
  return kWhPerUse * usesPerWeek * 52;
}

/**
 * Annual energy cost.
 * @param {number} electricityPricePerKWh
 * @param {number} kWhPerUse
 * @param {number} usesPerWeek
 * @returns {number}
 */
function annualEnergyCost(electricityPricePerKWh, kWhPerUse, usesPerWeek) {
  return annualEnergyKWh(kWhPerUse, usesPerWeek) * electricityPricePerKWh;
}

/**
 * Total cost over N years.
 * @param {{purchasePrice:number, powerW:number, hoursPerUse:number, usesPerWeek:number}} appliance
 * @param {{electricityPricePerKWh:number, years:number}} scenario
 * @returns {{purchaseCost:number, yearlyEnergyCost:number, totalEnergyCost:number, totalCost:number, yearlyKWh:number, kWhPerUse:number}}
 */
function totalCost(appliance, scenario) {
  const kWhPerUse = kWhPerUseFromPower(appliance.powerW, appliance.hoursPerUse);
  const yearlyKWh = annualEnergyKWh(kWhPerUse, appliance.usesPerWeek);
  const yearlyEnergyCost = yearlyKWh * scenario.electricityPricePerKWh;
  const totalEnergyCost = yearlyEnergyCost * scenario.years;
  const total = appliance.purchasePrice + totalEnergyCost;

  return {
    purchaseCost: appliance.purchasePrice,
    yearlyEnergyCost,
    totalEnergyCost,
    totalCost: total,
    yearlyKWh,
    kWhPerUse,
  };
}

/**
 * Compare two appliances.
 * @param {object} a
 * @param {object} b
 * @param {object} scenario
 * @returns {{cheaper:'A'|'B'|'equal', difference:number, totals:{A:any,B:any}}}
 */
function compare(a, b, scenario) {
  const A = totalCost(a, scenario);
  const B = totalCost(b, scenario);
  const diff = A.totalCost - B.totalCost;

  let cheaper = "equal";
  if (diff < 0) cheaper = "A";
  if (diff > 0) cheaper = "B";

  return {
    cheaper,
    difference: Math.abs(diff),
    totals: { A, B },
  };
}

module.exports = {
  kWhPerUseFromPower,
  annualEnergyKWh,
  annualEnergyCost,
  totalCost,
  compare,
};
