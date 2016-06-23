var formatUsd = require('format-usd');
module.exports.formatMoney = function formatMoney(m) {
  return formatUsd({amount: m, decimalPlaces: 0});
};
module.exports.formatMoneyCompact = function(num) {
  if(num < 1000) {
    return module.exports.formatMoney(num);
  } else if(num < 10000) {
    return '$' + (Math.round(num/100)/10) + 'k';
  } else if(num < 1000000) {
    return '$' + (Math.round(num/1000)) + 'k';
  } else if(num < 10000000){
    return '$' + (Math.round(num/10000)/100) + 'm';
  } else {
    return '$' + (Math.round(num/100000)/10) + 'm';
  }
};
