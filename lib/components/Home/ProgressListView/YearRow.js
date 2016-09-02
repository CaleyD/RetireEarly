'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import formatMoney from '../../../formatMoney';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class YearRow extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render () {
    const { year, portfolioValue, retirementPortfolio, isPostFI } = this.props;
    const progress = Math.min(1, portfolioValue / retirementPortfolio);
    const color = isPostFI ? '#33cc33' : '#0099ff';
    return (
      <View style={
          this.props.viewExpanded ? styles.progressRow : styles.progressRowSmall
        }>
        <View style={[
            styles.progressBar,
            {width: 320 * progress, backgroundColor: color}
          ]}/>
        <Text style={styles.progressRowYear}>
          {new Date().getYear() + 1900 + year + 1}</Text>
        <Text style={styles.progressRowAmount}>
          {formatMoney(portfolioValue)}</Text>
      </View>
    );
  }
}
YearRow.propTypes = {
  year: PropTypes.number.isRequired,
  portfolioValue: PropTypes.number.isRequired,
  retirementPortfolio: PropTypes.number.isRequired,
  isPostFI: PropTypes.bool.isRequired,
  viewExpanded: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    backgroundColor: '#999'
  },
  progressRowSmall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#999',
    height: 14,
    overflow: 'hidden'
  },
  progressRowYear: {
    color: 'white',
    paddingLeft: 10,
    backgroundColor: 'transparent'
  },
  progressRowAmount: {
    width: 60,
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 2,
    height: 40
  }
});
