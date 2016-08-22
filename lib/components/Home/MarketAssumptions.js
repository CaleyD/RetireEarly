'use strict';
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Slider } from 'react-native';
import { setWithdrawalRate, setAnnualReturn } from '../../reducers/scenario.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Ionicon from 'react-native-vector-icons/Ionicons';

class MarketAssumptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withdrawalRate: this.props.withdrawalRate,
      annualReturn: this.props.annualReturn
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render() {
    let { setAnnualReturn, setWithdrawalRate } = this.props;
    let { withdrawalRate, annualReturn } = this.state;
    return (
      <View style={{
          backgroundColor: '#00AA00BB',
          padding: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }}>
        {withdrawalRate > annualReturn ?
          <View style={{flexDirection: 'row'}}>
            <Ionicon name="md-warning" style={{fontSize: 30, color: 'orange'}} allowFontScaling={false}/>
            <Text>Withdrawal rate is higher than annual returns.</Text>
          </View> : null
        }
        <Text>Safe Withdrawal Rate: {(withdrawalRate*100.00).toFixed(2)}%</Text>
        <Slider minimumValue={.01} maximumValue={.08} step={.0025}
          value={withdrawalRate}
          onValueChange={value=>this.setState({withdrawalRate: value})}
          onSlidingComplete={setWithdrawalRate}/>

        <Text>Annual Return: {(annualReturn*100.00).toFixed(2)}%</Text>
        <Slider minimumValue={.01} maximumValue={.12} step={.0025}
          value={annualReturn}
          onValueChange={value=>this.setState({annualReturn: value})}
          onSlidingComplete={setAnnualReturn}/>
      </View>
    );
  }
}
MarketAssumptions.propTypes = {
  annualReturn: PropTypes.number.isRequired,
  withdrawalRate: PropTypes.number.isRequired,
  setAnnualReturn: PropTypes.func.isRequired,
  setWithdrawalRate: PropTypes.func.isRequired
};

export default connect(
  ({scenario}) => ({
    withdrawalRate: scenario.withdrawalRate,
    annualReturn: scenario.annualReturn
  }),
  { setAnnualReturn, setWithdrawalRate }
)(MarketAssumptions);
