'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, View, ProgressViewIOS } from 'react-native';
import styles from '../styles.js';
import formatMoney from '../formatMoney';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class YearRow extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    const { year, portfolioValue, retirementPortfolio } = this.props;
    return (
      <View style={[styles.progressRow, {height: 30}]}>
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
