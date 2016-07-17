'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, View } from 'react-native';
import { setInitialPortfolio } from '../reducers/index.js';
import { SidebarInputTrigger } from '../quick-dollar-input-sidebar';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import styles from '../styles.js';
import formatMoney from '../formatMoney';

export default class InitialPortfolioValueRow extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
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
