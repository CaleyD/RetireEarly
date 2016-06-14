var formatUsd = require('format-usd');
module.exports = function formatMoney(m) {
  return formatUsd({amount: m, decimalPlaces: 0});
};
