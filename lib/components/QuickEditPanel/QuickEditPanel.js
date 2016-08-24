import React, {Component, PropTypes} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import Chart from './Chart.js';
import Dial from 'react-native-dial';
import {calculate} from '../../calculator.js';
import {
  editPeriod, deletePeriod, setAnnualReturn, setWithdrawalRate, setInitialPortfolio
} from '../../reducers/scenario.js';
import {
  closeEditPeriod
} from '../../reducers/ui.js';

const numericTranslator = {
  fromDial: num => Math.round((num || 0) / 360 * 50) * 1000,
  toDial: num =>  ((num / 1000) / 50) * 360 || 0
}

class QuickEditPanel extends Component {
  constructor(props) {
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
  componentWillReceiveProps({scenario, propName}) {
    this.setState({
      scenario: JSON.parse(JSON.stringify(scenario)),
      propName
    });
  }
  updateTempValue(num) {
    num = numericTranslator.fromDial(num);
    const period = this.state.scenario.incomePeriods[this.props.yearIndex];
    period[this.state.propName] = num;
    this.forceUpdate();
  }
  saveValue(num) {
    num = numericTranslator.fromDial(num);
    this.setState({
      initialValue: num
    });
    this.props.editPeriod(
      this.props.scenario.incomePeriods[this.props.yearIndex],
      {[this.state.propName]: num}
    )
  }
  render() {
    const { yearIndex } = this.props;
    const { scenario, propName, initialValue } = this.state;

    const outlook = calculate(scenario, true);

    const period = scenario.incomePeriods[yearIndex];
    const maximumValue = 500000;

    return (
      <View>
        <Chart outlook={outlook}/>

        <View style={{flex: 1, flexDirection: 'row'}}>

          <TouchableOpacity onPress={()=>this.setState({propName: 'income', initialValue: period.income})}>
            <Text style={{color: propName==='income' ? 'red' : 'black'}}>
              Income: {period.income}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.setState({propName: 'expenses', initialValue: period.expenses})}>
            <Text style={{color: propName==='expenses' ? 'red' : 'black'}}>
              Expenses: {period.expenses}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text>Savings Rate</Text>
          <Text>Years: {outlook.yearsToRetirement}</Text>
        </View>

        {yearIndex > 0 ?
          <Text>Delete</Text> : null
        }

        <Text>Move</Text>

        <TouchableOpacity onPress={closeEditPeriod}>
          <Text>Back (use router and navigator)</Text>
        </TouchableOpacity>

        <Dial style={styles.dial}
          value={numericTranslator.toDial(initialValue)}
          minimumValue={numericTranslator.toDial(0)}
          maximumValue={numericTranslator.toDial(maximumValue)}
          onValueChange={this.updateTempValue}
          onSlidingComplete={this.saveValue}
          />
      </View>
    )
  }
}
QuickEditPanel.propTypes = {
  scenario: PropTypes.object.isRequired,
  propName: PropTypes.oneOf(['income','expenses']).isRequired,
  yearIndex: PropTypes.number.isRequired,
  editPeriod: PropTypes.func.isRequired,
  deletePeriod: PropTypes.func.isRequired
}

var styles = {
  dial: {flex: 1, marginVertical: 10, width: 140, height: 140, alignSelf: 'center'}
}

export default connect(
  ({scenario}) => ({scenario}),
  {
    editPeriod, deletePeriod, setAnnualReturn,
    setWithdrawalRate, setInitialPortfolio
  }
)(QuickEditPanel);
