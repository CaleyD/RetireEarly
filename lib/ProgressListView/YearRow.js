'use strict';
import React, { PropTypes } from 'react';
import { Text, View, ProgressViewIOS } from 'react-native';
import styles from '../styles.js';
import formatMoney from '../formatMoney';

export default function YearRow(props) {
  const { year, portfolioValue, retirementPortfolio } = props;
  return (
    <View style={[styles.progressRow, {height: 30}]}>
      <Text style={styles.progressRowYear}>{new Date().getYear() + 1900 + year}</Text>
      <ProgressViewIOS style={styles.progressBar}
        progress={portfolioValue / retirementPortfolio}/>
      <Text style={styles.progressRowAmount}>{formatMoney(portfolioValue)}</Text>
    </View>
  );
}
YearRow.propTypes = {
  year: PropTypes.number.isRequired
};
