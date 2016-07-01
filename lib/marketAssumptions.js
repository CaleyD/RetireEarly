import React, { PropTypes } from 'react';
import PureComponent from './pureComponent';
import {
  Text,
  TextInput,
  TouchableHighlight,
  View,
  StyleSheet
} from 'react-native';

var scenarioStore = require('./scenarioStore');

class InputFormInputRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: parseInt(props.value || 0)};
  }
  render() {
    return (
      <View style={[styles.scenarioFormRow, {height: 44}]}>
        <Text style={styles.scenarioFormRowLabel}>{this.props.labelText}</Text>
        <TextInput value={this.state.value.toString()} style={styles.scenarioFormRowInput}
            onChange={(num)=>this.onChange(num)}
            keyboardType={'decimal-pad'}
            />
      </View>
    );
  }
  formatPercent(value) {
    return (value * 100).toFixed(2) + '%'
  }
  onChange(num) {
    this.setState({value: num});
    this.props.onChange(num);
  }
}
InputFormInputRow.propTypes = {
  value: PropTypes.number.isRequired,
  labelText: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['dollar', 'percent', 'years']),
  onChange: PropTypes.func
};

class MarketAssumptions extends PureComponent {
  render() {
    return (
      <View style={styles.card}>
        <View style={[styles.cardHeader, styles.roundedTop]}>
          <Text style={{ backgroundColor: 'transparent' }}>Market Assumptions</Text>
        </View>
        {/* TODO - add horizontal scrolling options for: conservative, moderate, aggressive */}

        <InputFormInputRow labelText='Annual Return' type='percent'
          value={this.props.scenario.annualReturn}
          onChange={(num)=>scenarioStore.setAnnualReturn(num)}/>
        <InputFormInputRow labelText='Withdrawal Rate' type='percent'
          value={this.props.scenario.withdrawalRate}
          onChange={(num)=>scenarioStore.setWithdrawalRate(num)}/>
      </View>
    );
  }
}
MarketAssumptions.propTypes = {
  scenario: PropTypes.object.isRequired
};

var styles = StyleSheet.create({
  card: {
    backgroundColor: '#eeeeee',
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 2,
    overflow: 'hidden',

    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  },
  cardHeader: {
    backgroundColor: '#ffffff',
    padding: 8
  },
  scenarioFormRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#bbbbbb',
    marginLeft: 30
  },
  scenarioFormRowLabel: {
    flex: 0.6,
    paddingTop: 13,
    backgroundColor: 'rgba(52,52,52,0)'
  },
  scenarioFormRowInput: {
    flex: 0.3,
    fontSize: 13,
    padding: 4,
    color: 'black'
  },
  roundedTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  }
});

export default MarketAssumptions;
