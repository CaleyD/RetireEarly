import React, { Component, PropTypes } from 'react';
import ReactNative, {
  AppRegistry,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
  NavigatorIOS,
  ListView
} from 'react-native';
import NativeMethodsMixin from 'NativeMethodsMixin';
import * as Animatable from 'react-native-animatable';
import NumberInput from './lib/react-native-numberinput';
import PureComponent from './lib/pureComponent';
import OutlookTablePage from './lib/outlookPage';
import styles from './lib/styles.js';

var scenarioStore = require('./lib/scenarioStore');
var calc = require('./lib/calculator.js');
var formatMoney = require('./lib/formatMoney.js').formatMoney;

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
              scrollview={scrollView}
              getFormattedText={(num)=>formatMoney(num)}
              />
            : this.props.type === 'percent' ?
          <NumberInput value={this.state.value} inputStyle={styles.scenarioFormRowInput}
              onChange={(num)=>this.onChange(num)}
              scrollview={scrollView}
              getFormattedText={(num)=>this.formatPercent(num)}
              />
            :
          <NumberInput value={this.state.value} inputStyle={styles.scenarioFormRowInput}
              onChange={(num)=>this.onChange(num)}
              scrollview={scrollView}
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

// TODO: refactor - components not technically PURE because of this variable!
var scrollView;

class EarningPeriodListView extends PureComponent {
  constructor(props) {
    super(props);
    this._renderID = 0;
  }
  render() {
    var incomePeriods = this.props.incomePeriods;
    return (
      <ScrollView alwaysBounceVertical={false} ref={(c) => scrollView = c} style={{height: 300}} >
        {incomePeriods.map((incomePeriod, index) => {
          var allowDelete = incomePeriods.length > 1;
          var view;

          return (
            <Animatable.View style={styles.card} ref={(c)=>view = c}
              key={index + ':' + this._renderID}>

              <View style={[styles.cardHeader, {flexDirection: 'row'}]}>
                <Text style={{flex: .4}}>
                  Earning period {this.props.index===0 && !allowDelete ? '' : index + 1}
                </Text>
                {allowDelete ?
                  <TouchableHighlight underlayColor='#99d9f4' onPress={()=>this.removePeriod(view, incomePeriod)}>
                      <Text style={{flex: .4, textAlign:'right'}}>Remove</Text>
                  </TouchableHighlight>
                  : null
                }
              </View>

              <InputFormInputRow labelText='Annual Income' type='dollar'
                value={incomePeriod.annualIncome}
                onChange={(num)=>this.onChange(incomePeriod, 'annualIncome', num)}/>
              <InputFormInputRow labelText='Annual Spending' type='dollar'
                value={incomePeriod.annualSpending}
                onChange={(num)=>this.onChange(incomePeriod, 'annualSpending', num)}/>

              {(index !== incomePeriods.length-1) ?
                <InputFormInputRow labelText='Years' type='years'
                  value={incomePeriod.years}
                  onChange={(num)=>this.onChange(incomePeriod, 'years', num)}/>
                :
                <TouchableHighlight underlayColor='#99d9f4'
                  style={[styles.button, {marginBottom: 4, marginHorizontal: 4}]}
                  onPress={()=> this.addPeriod()}>
                  <Text style={styles.buttonText}>Add earning period</Text>
                </TouchableHighlight>
              }
            </Animatable.View>
          );
        })}

      </ScrollView>
    );
  }
  onChange(incomePeriod, propName, num) {
    var updates = {};
    updates[propName] = num;
    scenarioStore.updateIncomePeriod(incomePeriod, updates);
  }
  removePeriod(periodComponent, incomePeriod) {
    NativeMethodsMixin.measure.call(periodComponent, (a,b,c,height) => {
      periodComponent.transition({height}, {height: 0}, 300);
      setTimeout(()=>scenarioStore.removeIncomePeriod(incomePeriod), 300);
    });

    this._renderID++; // so deleted/animated-out rows don't get reused
  }
  addPeriod() {
    var latestPeriod = this.props.incomePeriods[this.props.incomePeriods.length-1];

    scenarioStore.appendIncomePeriod(1, {
      annualIncome: latestPeriod.annualIncome,
      annualSpending: latestPeriod.annualSpending
    });
  }
}
EarningPeriodListView.propTypes = {
  incomePeriods: PropTypes.array.isRequired
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

class InputForm extends PureComponent {
  render() {
    var scenario = this.props.scenario;
    return (
      <View style={styles.container}>
        {/* TODO - allow negative values for people in debt starting out */}
        <View style={styles.card}>
          <InputFormInputRow labelText='Initial Portfolio Value' type='dollar'
            value={this.props.scenario.initialPortfolioValue}
            onChange={(num)=>scenarioStore.setInitialPortfolioValue(num)}/>
        </View>

        <EarningPeriodListView incomePeriods={scenario.incomePeriods} scenario={scenario}/>

        <MarketAssumptions scenario={scenario}/>

      </View>
    );
  }
}
InputForm.propTypes = {
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
                You will need {formatMoney(this.props.retirementOutlook.retirementPortfolioValue)} to
                retire but you will never get there because you are outspending your income.
              </Text>
            : yearsToRetirement <= 0 ?
              <Text>
                You need {formatMoney(this.props.retirementOutlook.retirementPortfolioValue)} and
                you already have it - you can retire now!
              </Text>
            :
              <Text>
                You can retire in {yearsToRetirement} {yearsToRetirement === 1 ? 'year ' : 'years '}
                with {formatMoney(this.props.retirementOutlook.retirementPortfolioValue)}
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

    // using ScrollView for dismiss keyboard functionality
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}
          style={{backgroundColor:'green'}}>

        <Intro/>

        {this.state.initialized ?
          <InputForm scenario={scenario}/>
          : null
        }
        {this.state.initialized && retirementOutlook ?
          <Outlook style={{alignSelf:'flex-end'}} navigator={this.props.navigator}
            scenario={scenario} retirementOutlook={retirementOutlook}/>
          : null
        }

      </ScrollView>
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
