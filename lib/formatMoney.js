module.exports.formatMoneyCompact = function(num) {
  if(num < 1000) {
    return '$' + num;
  } else if(num < 10000) {
    return '$' + (Math.round(num/100)/10) + 'k';
  } else if(num < 1000000) {
    return '$' + (Math.round(num/1000)) + 'k';
  } else if(num < 10000000) {
    return '$' + (Math.round(num/10000)/100) + 'm';
  } else if(num < 100000000) {
    return '$' + (Math.round(num/10000)/100) + 'm';
  } else {
    return '$' + (Math.round(num/1000000)) + 'm';
  }
};
