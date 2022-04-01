const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const movingAverage = (data) => data.reduce((a, b) => a + b, 0) / data.length;
const std = (data) => {
    const sma = movingAverage(data);
    let sum = 0;
    data.forEach((element) => {
        sum += (element - sma) * (element - sma);
    });
    const population_standard_deviation = Math.sqrt(sum / data.length);
    return population_standard_deviation;
};
const UpperbollingerBand = (ma, m, std) => {
    return ma + m * std;
};
const LowerbollingerBand = (ma, m, std) => {
    return ma - m * std;
};
const crossedBollingerBand = (currentPrice, std, ma) => {
    return (currentPrice - ma) / std;
};
module.exports = {
    delay,
    movingAverage,
    std,
    crossedBollingerBand,
    LowerbollingerBand,
    UpperbollingerBand,
};
//# sourceMappingURL=utilities.js.map