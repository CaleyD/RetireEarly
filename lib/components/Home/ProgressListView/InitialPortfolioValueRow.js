'use strict';
import React, { PropTypes } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from './styles.js';
import formatMoney from '../../../formatMoney';

export default function InitialPortfolioValueRow (
  { initialPortfolio, editInitialPortfolio }
) {
  const year = new Date().getYear() + 1900;
  return (
    <TouchableOpacity onPress={editInitialPortfolio}>
      <View style={[
          styles.progressRow, {borderTopColor: '#ccc', borderTopWidth: 1}
        ]}>
        <Text style={styles.progressRowYear}>{year}</Text>
        <View style={{flex: 1}}>
          <View style={{
              alignItems: 'center',
              height: 44,
              backgroundColor: 'transparent',
              flexDirection: 'row'}}>
            <Text style={{flex: 1, color: '#FFF'}}>
              Initial portfolio value</Text>
            <Text style={styles.progressRowAmount}>
              {formatMoney(initialPortfolio)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
InitialPortfolioValueRow.propTypes = {
  initialPortfolio: PropTypes.number,
  editInitialPortfolio: PropTypes.func.isRequired
};
