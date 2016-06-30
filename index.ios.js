import React, { Component, PropTypes } from 'react';
import ReactNative, {
  AppRegistry,
  Text,
  TouchableHighlight,
  View,
  NavigatorIOS
} from 'react-native';
import NumberInput from './lib/react-native-numberinput';
import PureComponent from './lib/pureComponent';
import OutlookTablePage from './lib/outlookPage';
import styles from './lib/styles.js';

var scenarioStore = require('./lib/scenarioStore');
var calc = require('./lib/calculator.js');
import formatMoneyCompact from './lib/formatMoney';

class InputFormInputRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: parseInt(props.value || 0)};
  }
  render() {
    return (
      <View style={[styles.scenarioFormRow, {height: 44}]}>
        <Text style={styles.scenarioFormRowLabel}>{this.props.labelText}</Text>
        {(this.props.type === 'dollar' ?
          <NumberInput value={this.state.value} inputStyle={styles.scenarioFormRowInput}
              onChange={(num)=>this.onChange(num)}
              getFormattedText={(num)=>formatMoneyCompact(num)}
              />
            : this.props.type === 'percent' ?
          <NumberInput value={this.state.value} inputStyle={styles.scenarioFormRowInput}
              onChange={(num)=>this.onChange(num)}
              keyboardType={'decimal-pad'}
              getFormattedText={(num)=>this.formatPercent(num)}
              />
            :
          <NumberInput value={this.state.value} inputStyle={styles.scenarioFormRowInput}
              onChange={(num)=>this.onChange(num)}
              />
        )}
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

class Intro extends PureComponent {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>Early Retirement Calculator!</Text>
        <Text style={styles.instructions}>Your path to financial independence</Text>
      </View>
    );
  }
}

class Outlook extends PureComponent {
  render() {
    var yearsToRetirement = Math.round(10 * this.props.retirementOutlook.yearsToRetirement) / 10;
    return (
      <TouchableHighlight underlayColor='#99d9f4'
        onPress={()=>this.navigateToDetails()}
        style={styles.outlook}>
        <View>
          {
            yearsToRetirement === NaN ?
              <Text>
                You will need {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolioValue)} to
                retire but you will never get there because you are outspending your income.
              </Text>
            : yearsToRetirement <= 0 ?
              <Text>
                You need {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolioValue)} and
                you already have it - you can retire now!
              </Text>
            :
              <Text>
                You can retire in {yearsToRetirement} {yearsToRetirement === 1 ? 'year ' : 'years '}
                with {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolioValue)}
              </Text>
          }
          <Text style={styles.buttonText}>Go</Text>
        </View>
      </TouchableHighlight>
    );
  }
  navigateToDetails() {
    this.props.navigator.push({
        title: "Path to Financial Independence",
        component: OutlookTablePage,
        backButtonTitle: 'back',
        passProps: {
          toggleNavBar: this.props.toggleNavBar,
          scenario: this.props.scenario
        }
      });
  }
}

// Because of limitations of NavigatorIOS - this is acting as the controller view
class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      scenario: null
    };
    scenarioStore.getScenario((err, scenario) => {
      if(err) {
        throw new Error(err);
      }
      this.setState({ scenario: scenario, initialized: true });
    });
    this.scenarioListener = scenarioStore.addListener('change',
      (scenario) => this.onScenarioChanged(scenario)
    );
  }

  componentWillUnmount() {
    this.scenarioListener.remove();
  }

  onScenarioChanged(scenario) {
    this.setState({ scenario });
  }

  render() {
    var scenario = this.state.scenario;

    var retirementOutlook = scenario ? calc.calculate(scenario) : null;

    return (
      <View contentContainerStyle={styles.container} scrollEnabled={false}
          style={{backgroundColor:'green'}}>

        <Intro/>

        {this.state.initialized ?
          <MarketAssumptions scenario={scenario}/>
          : null
        }
        {this.state.initialized && retirementOutlook ?
          <Outlook style={{alignSelf:'flex-end'}} navigator={this.props.navigator}
            scenario={scenario} retirementOutlook={retirementOutlook}/>
          : null
        }

      </View>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.statics = {
      title: '<NavigatorIOS>',
      description: 'Early Retirement Calculator',
      external: true,
    };
  }

  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: this.statics.title,
          component: MainScreen,
          navigationBarHidden: true
        }}
        itemWrapperStyle={styles.itemWrapper}
        tintColor="green"
        barTintColor="green"
        shadowHidden={true}
      />
    );
  }
}

AppRegistry.registerComponent('EarlyRetireCalc', () => App);
