'use strict';
export default function(num) {
  let prefix = '$';
  if(num < 0) {
    prefix = '-$';
    num = -1 * num;
  }
  if(num < 1000) {
    return prefix + num;
  } else if(num < 10000) {
    return prefix + (Math.round(num/100)/10) + 'k';
  } else if(num < 1000000) {
    return prefix + (Math.round(num/1000)) + 'k';
  } else if(num < 10000000) {
    return prefix + (Math.round(num/10000)/100) + 'm';
  } else if(num < 100000000) {
    return prefix + (Math.round(num/10000)/100) + 'm';
  } else {
    return prefix + (Math.round(num/1000000)) + 'm';
  }
}
