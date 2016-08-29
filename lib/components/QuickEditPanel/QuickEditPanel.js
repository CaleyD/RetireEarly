import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Chart from './Chart.js';
import Dial from 'react-native-dial';
import { calculate } from '../../calculator.js';
import formatMoney from '../../formatMoney.js';
import {
  editPeriod, deletePeriod, setAnnualReturn, setWithdrawalRate,
  setInitialPortfolio
} from '../../reducers/scenario.js';

const numericTranslator = {
  fromDial: num => Math.round((num || 0) / 360 * 50) * 1000,
  toDial: num =>  num / 1000 / 50 * 360 || 0
};

class QuickEditPanel extends Component {
  constructor (props) {
    super(props);
    const {scenario, yearIndex, propName} = props;
    this.state = {
      scenario: JSON.parse(JSON.stringify(scenario)),
      initialValue: scenario.incomePeriods[yearIndex][propName],
      propName
    };
    this.updateTempValue = this.updateTempValue.bind(this);
    this.saveValue = this.saveValue.bind(this);
  }
  componentWillReceiveProps ({scenario, propName}) {
    this.setState({
      scenario: JSON.parse(JSON.stringify(scenario)),
      propName
    });
  }
  updateTempValue (num) {
    num = numericTranslator.fromDial(num);
    const period = this.state.scenario.incomePeriods[this.props.yearIndex];
    period[this.state.propName] = num;
    this.forceUpdate();
  }
  saveValue (num) {
    num = numericTranslator.fromDial(num);
    this.setState({ initialValue: num });
    this.props.editPeriod(
      this.props.scenario.incomePeriods[this.props.yearIndex],
      { [this.state.propName]: num }
    );
  }
  render () {
    const { yearIndex } = this.props;
    const { scenario, propName, initialValue } = this.state;
    const outlook = calculate(scenario, true);
    const { income, expenses } = scenario.incomePeriods[yearIndex];
    const maximumValue = 500000;

    return (
      <View>
        <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
          onLayout={({nativeEvent: layout})=>
            this.setState({
              chartWidth: layout.width,
              chartHeight: layout.height
            })
          }>
          <Chart
            width={this.state.chartWidth || 320}
            height={this.state.chartHeight || 500}
            outlook={outlook}/>
        </View>

        <View style={{flex: 1, flexDirection: 'row', marginTop: 100}}>
          <TouchableOpacity onPress={()=>
              this.setState({propName: 'income', initialValue: income})}>
            <Text style={{color: propName === 'income' ? 'red' : 'black'}}>
              Income: {formatMoney(income)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>
              this.setState({propName: 'expenses', initialValue: expenses})}>
            <Text style={{color: propName === 'expenses' ? 'red' : 'black'}}>
              Expenses: {formatMoney(expenses)}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>Savings Rate: {(income - expenses) / income}%</Text>
          <Text>
            Years to financial independence: {outlook.yearsToRetirement}
          </Text>
        </View>

        {yearIndex > 0 ?
          <Text>Delete</Text> : null
        }

        <Dial style={styles.dial}
          value={numericTranslator.toDial(initialValue)}
          minimumValue={numericTranslator.toDial(0)}
          maximumValue={numericTranslator.toDial(maximumValue)}
          onValueChange={this.updateTempValue}
          onSlidingComplete={this.saveValue}
          />
      </View>
    );
  }
}
QuickEditPanel.propTypes = {
  scenario: PropTypes.object.isRequired,
  propName: PropTypes.oneOf(['income','expenses']).isRequired,
  yearIndex: PropTypes.number.isRequired,
  editPeriod: PropTypes.func.isRequired,
  deletePeriod: PropTypes.func.isRequired
};

const styles = {
  dial: {
    flex: 1,
    marginVertical: 10,
    width: 140,
    height: 140,
    alignSelf: 'center'
  }
};

export default connect(
  ({scenario}) => ({scenario}),
  {
    editPeriod, deletePeriod, setAnnualReturn,
    setWithdrawalRate, setInitialPortfolio
  }
)(QuickEditPanel);
