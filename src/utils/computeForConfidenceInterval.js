import tValues from './tValues';

export function floorOrCeil(value) {
  const roundOff = 50;
  const mod = value % roundOff;
  if (mod >= 30) {
    return value + roundOff - mod;
  }
  if (mod < 30) {
    return  value - mod;
  }
  return value;
}
/**
 * Computes for the confidence interval with 95% level of confidence using t-statistic
 * @param {number[]} prices - array of properties to compare
 *
 * @returns {number, number} confidence interval and rental range
 */
export default function(prices) {
  const degreesOfFreedom = prices.length - 1 > 30 ? 30 : prices.length - 1;
  const tValue = tValues[degreesOfFreedom];
  const sum = prices.reduce(function(previous, current) {
    if (previous) {
      return previous + current;
    }
    return current;
  }, 0);
  const average = sum / prices.length;
  const stdPt1 = prices.reduce(function(previous, current) {
    const value = (current - average) * (current - average);
    if (previous) {
      return previous + value;
    }
    return value;
  }, 0);
  const averageOfStdPt1 = stdPt1 / degreesOfFreedom;
  const standardDeviation = Math.sqrt(averageOfStdPt1);
  const cI = tValue * (standardDeviation / Math.sqrt(prices.length));
  const confidenceInterval = floorOrCeil(Math.floor(cI));
  return {
    confidenceInterval,
    rentalRange: floorOrCeil(average)
  };
};
