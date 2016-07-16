'use strict';
import React, { PropTypes } from 'react';
import { Text, View } from 'react-native';
import { setInitialPortfolio } from '../reducers/index.js';
import { SidebarInputTrigger } from '../quick-dollar-input-sidebar';
import PureComponent from '../pureComponent';
import styles from '../styles.js';
import formatMoney from '../formatMoney';

export default class InitialPortfolioValueRow extends PureComponent {
  render() {
    const year = new Date().getYear() + 1900;
    const {initialPortfolio, dispatch} = this.props;
    return (
      <View style={[styles.progressRow, {borderTopColor: '#ccc', borderTopWidth: 1}]}>
        <Text style={styles.progressRowYear}>{year}</Text>
        <View style={{flex: 1}}>
          <SidebarInputTrigger
            value={initialPortfolio}
            onChange={(num)=>dispatch(setInitialPortfolio(num))}
            renderChildren={(selected)=>(
              <View style={{
                  alignItems: 'center',
                  height: 44,
                  backgroundColor: selected ? 'orange' : 'transparent',
                  flexDirection: 'row'}}>
                <Text style={{flex: 1}}>Initial portfolio value</Text>
                <Text style={styles.progressRowAmount}>{formatMoney(initialPortfolio)}</Text>
              </View>
            )}
            />
        </View>
      </View>
    );
  }
}
InitialPortfolioValueRow.propTypes = {
  initialPortfolio: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};
