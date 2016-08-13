'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import formatMoney from '../formatMoney';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class YearRow extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { year, portfolioValue, retirementPortfolio } = this.props;
    const progress = portfolioValue / retirementPortfolio;
    const color = progress>=1 ? '#33cc33': '#0099ff';
    return (
      <View style={styles.progressRow}>
        <View style={{position: 'absolute', left: 0, top: 2, height: 40, width: 320*progress, backgroundColor: color}}/>
        <Text style={styles.progressRowYear}>{new Date().getYear() + 1900 + year + 1}</Text>
        <Text style={styles.progressRowAmount}>{formatMoney(portfolioValue)}</Text>
      </View>
    );
  }
}
YearRow.propTypes = {
  year: PropTypes.number.isRequired
};

var styles = StyleSheet.create({
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    backgroundColor: '#999'
  },
  progressRowYear: {
    color: 'white',
    textAlign: 'right',
    paddingLeft: 10,
    backgroundColor: 'transparent'
  },
  progressRowAmount: {
    width: 60,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  }
});
