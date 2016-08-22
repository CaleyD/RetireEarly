'use strict';
import React, { PropTypes } from 'react';
import { Text, View } from 'react-native';
import { SidebarInputTrigger } from '../quick-dollar-input-sidebar';
import styles from './styles.js';
import formatMoney from '../../formatMoney';

export default function InitialPortfolioValueRow({initialPortfolio, onChange}) {
  const year = new Date().getYear() + 1900;
  return (
    <View style={[styles.progressRow, {borderTopColor: '#ccc', borderTopWidth: 1}]}>
      <Text style={styles.progressRowYear}>{year}</Text>
      <View style={{flex: 1}}>
        <SidebarInputTrigger
          value={initialPortfolio}
          onChange={onChange}
          renderChildren={(selected)=>(
            <View style={{
                alignItems: 'center',
                height: 44,
                backgroundColor: selected ? 'orange' : 'transparent',
                flexDirection: 'row'}}>
              <Text style={{flex: 1, color: '#FFF'}}>Initial portfolio value</Text>
              <Text style={styles.progressRowAmount}>{formatMoney(initialPortfolio)}</Text>
            </View>
          )}
          />
      </View>
    </View>
  );
}
InitialPortfolioValueRow.propTypes = {
  initialPortfolio: PropTypes.number,
  onChange: PropTypes.func.isRequired
};
