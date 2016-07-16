'use strict';
import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, View, ProgressViewIOS } from 'react-native';
import PureComponent from '../pureComponent';
import styles from '../styles.js';
import formatMoney from '../formatMoney';

export default class YearRow extends PureComponent {
  setNativeProps(props) {
    // this is here to support SortableListView
    this._view.setNativeProps(props);
  }
  render() {
    const { year, portfolioValue, retirementPortfolio, onAddPeriod } = this.props;
    return (
      <View style={[styles.progressRow, {height: 30}]} ref={v => this._view=v}>
        <Text style={styles.progressRowYear}>{new Date().getYear() + 1900 + year}</Text>
        <ProgressViewIOS style={styles.progressBar}
          progress={portfolioValue / retirementPortfolio}/>
        <Text style={styles.progressRowAmount}>{formatMoney(portfolioValue)}</Text>
      </View>
    );
  }
}
YearRow.propTypes = {
  year: PropTypes.number.isRequired
};
