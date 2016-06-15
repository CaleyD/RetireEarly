/**
 * Sample React Native App
 */

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ScrollView,
  NavigatorIOS,
  StatusBar,
  ListView,
  PickerIOS,
  Switch
} from 'react-native';
var scenarioStore = require('./lib/scenarioStore');
var calc = require('./lib/calculator.js');
var formatMoney = require('./lib/formatMoney.js');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class InputFormInputRow extends Component {
  constructor(props) {
    super(props);
    this.state = {value: (props.value || '').toString()};
  }
  render() {
    return (
      <View style={[styles.scenarioFormRow, this.props.expanded ? {height: 44} : {}]}>
        <Text style={styles.scenarioFormRowLabel}>{this.props.labelText}:</Text>
        {this.props.expanded ?
          (this.props.type === 'dollar' ?
            <TextInput style={styles.scenarioFormRowInput}
                maxLength={9} autoCorrect={false} keyboardType='number-pad'
                value={'$' + this.state.value.toString()}
                onChangeText={this.onChangeDollarText.bind(this)}
                />
            :
            <TextInput style={styles.scenarioFormRowInput}
                maxLength={7} autoCorrect={false} keyboardType='decimal-pad'
                value={this.formatPercent(this.state.value)}
                onChangeText={this.onChangePercentText.bind(this)}
                />
          ) : (
            <Text style={[styles.scenarioFormRowLabel, { textAlign: 'left', paddingLeft: 4 }]}>
              {this.props.type === 'dollar' ?
                formatMoney(this.state.value) :
                this.formatPercent(this.state.value)
              }
            </Text>
          )
        }
      </View>
    );
  }
  formatPercent(value) {
    return (value * 100).toFixed(2) + '%'
  }
  onChangeDollarText(text) {
    if(text[0] === '$') { text = text.substr(1); }
    this.setState({value: text});
    if(this.props.onChange) {
      this.props.onChange(parseInt(text));
    }
  }
  onChangePercentText(text) {
    if(text.indexOf('%') >= 0) { text = text.replace('%', ''); }
    var num = Math.min(100, parseFloat(text));
    this.setState({value: num / 100});
    if(this.props.onChange) {
      this.props.onChange(num / 100);
    }
  }
  /*
  GetPercentPicker() {
    <PickerIOS style={{width: 300, height: 300}}
        selectedValue={this.props.value.toString()}
        >
      {Array(401).fill(1).map(function(el,i) {
        var value = i / 4;
        return <PickerIOS.Item key={value+''} value={value.toString()} label={value.toFixed(2)+'%'} />;
      })}
    </PickerIOS>
  }*/
}
InputFormInputRow.propTypes = {
  value: PropTypes.number.isRequired,
  labelText: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['dollar', 'percent', 'years']),
  expanded: PropTypes.bool,
  onChange: PropTypes.func
};

class EarningPeriod extends Component {
  render() {
    var incomePeriod = this.props.earningPeriod;
    return (
      <View>
        <Text>Earning period {this.props.index + 1}</Text>
        {this.props.allowDelete ?
          <TouchableHighlight underlayColor='#99d9f4' onPress={()=>this.removePeriod()}>
              <Text style={{flex: .4, textAlign:'right'}}>Remove</Text>
          </TouchableHighlight>
          :
          null
        }

        <InputFormInputRow labelText='Annual Income' type='dollar'
          value={incomePeriod.annualIncome} expanded={this.props.expanded}
          onChange={(num)=>this.onChange('annualIncome', num)}/>
        <InputFormInputRow labelText='Annual Spending' type='dollar'
          value={incomePeriod.annualSpending} expanded={this.props.expanded}
          onChange={(num)=>this.onChange('annualSpending', num)}/>

        {!this.props.finalEarningPeriod ?
          <InputFormInputRow labelText='Years' type='dollar'
            value={incomePeriod.years} expanded={this.props.expanded}
            onChange={(num)=>this.onChange('years', num)}/>
          :
          null
        }
      </View>
    );
  }
  onChange(propName, num) {
    // TODO: use immutable.js
    this.props.earningPeriod[propName] = num;
    scenarioStore.setScenario(this.props.scenario);
  }
  removePeriod() {
    this.props.scenario.incomePeriods.splice(this.props.index, 1);
    scenarioStore.setScenario(this.props.scenario);
  }
}
EarningPeriod.propTypes = {
  index: PropTypes.number.isRequired,
  finalEarningPeriod: PropTypes.bool.isRequired,
  allowDelete: PropTypes.bool.isRequired,
  earningPeriod: PropTypes.object.isRequired,
  scenario: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired
};

class InputForm extends Component {
  render() {
    var scenario = this.props.scenario;
    var incomePeriods = scenario.incomePeriods;
    return (
      <View style={styles.scenarioForm}>
        {/* TODO - allow negative values for people in debt starting out */}
        {this.renderRow('initialPortfolioValue', 'Initial Portfolio Value', 'dollar')}
        <Text>Market Assumptions</Text>
        {/* TODO - add horizontal scrolling options for: conservative, moderate, aggressive */}
        {this.renderRow('annualReturn', 'Annual Return', 'percent')}
        {this.renderRow('withdrawalRate', 'Withdrawal Rate', 'percent')}

        {incomePeriods.map((incomePeriod, index) =>
          <EarningPeriod key={index} expanded={this.props.expanded}
            scenario={scenario} earningPeriod={incomePeriod} index={index}
            allowDelete={incomePeriods.length > 1}
            finalEarningPeriod={index === incomePeriods.length-1}
            />
        )}

        <TouchableHighlight underlayColor='#99d9f4'
            onPress={()=> {
              var latestPeriod = incomePeriods[incomePeriods.length-1];
              latestPeriod.years = 1;
              incomePeriods.push({
                annualIncome: latestPeriod.annualIncome,
                annualSpending: latestPeriod.annualSpending
              });
              scenarioStore.setScenario(scenario);
            }}>
            <View>
              <Text>Add earning period</Text>
            </View>
        </TouchableHighlight>
        <View>
          <Text>Retirement Annual Expenses</Text>
        </View>
      </View>
    );
  }
  renderRow(propName, label, type) {
    return (
      <InputFormInputRow labelText={label} type={type}
        value={this.props.scenario[propName]} expanded={this.props.expanded}
        onChange={(num)=>this.onChange(propName, num)}/>
    );
  }
  onChange(propName, num) {
    // TODO: use immatable.js
    this.props.scenario[propName] = num;
    scenarioStore.setScenario(this.props.scenario);
  }
}
InputForm.propTypes = {
  scenario: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired
};

class Intro extends Component {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>
          Early Retirement Calculator!
        </Text>
        <Text style={styles.instructions}>
          Your path to financial independence
        </Text>
      </View>
    );
  }
}

class Outlook extends Component {
  render() {
    var yearsToRetirement = Math.round(10 * this.props.retirementOutlook.yearsToRetirement) / 10;
    return (
      <View style={styles.outlook}>
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

        <TouchableHighlight underlayColor='#99d9f4'
          onPress={()=>this.navigateToDetails()}>
          <Text style={styles.buttonText}>Go</Text>
        </TouchableHighlight>
      </View>
    );
  }
  navigateToDetails() {
    this.props.navigator.push({
        title: "Path to Financial Independence",
        component: OutlookTablePage,
        backButtonTitle: 'back',
        passProps: {
          toggleNavBar: this.props.toggleNavBar,
          annualBalances: this.props.retirementOutlook.annualBalances
        }
      });
  }
}

class OutlookTablePage extends Component {
  render() {
    var datasource = ds.cloneWithRows(
      this.props.annualBalances.map(function(entry, index) {
        return { portfolioValue: entry, years: index + 1 };
      })
    );
    return (
      <ListView enableEmptySections={true}
        dataSource={datasource}
        renderRow={(rowData) =>
            <View style={styles.outlookRow}>
              <Text>{formatMoney(rowData.portfolioValue)}</Text>
              <Text style={{textAlign: 'right', flex: .4}}>
                after {rowData.years} {rowData.years === 1 ? 'year' : 'years'}
              </Text>
            </View>
          }
        />
    );
  }
}

// Because of limitations of NavigatorIOS - this is acting as the controller view
class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      scenario: {
        initialPortfolioValue: 100000,
        annualReturn: .05,
        withdrawalRate: .04,
        incomePeriods: [{
          annualIncome: 100000,
          annualSpending: 45000
        }]
      },
      inputsExpanded: true
    };
    scenarioStore.getScenario((err, scenario) => {
      this.setState({ scenario: scenario, initialized: true });
    });
    scenarioStore.onChange((scenario)=>this.onScenarioChanged(scenario));
  }

  onScenarioChanged(scenario) {
    this.setState({ scenario });
  }

  render() {
    var scenario = this.state.scenario;

    var retirementOutlook = calc.calculate(
      scenario.incomePeriods[0].annualIncome,
      scenario.incomePeriods[0].annualSpending,
      scenario.initialPortfolioValue, scenario.annualReturn,
      scenario.withdrawalRate);

    // using ScrollView for dismiss keyboard functionality
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}
          style={{backgroundColor:'green'}}>

        <Intro/>

        {this.state.initialized ?
          <ScrollView scrollEnabled={this.state.inputsExpanded}>
            <TouchableOpacity onPress={() => this.setState({inputsExpanded: !this.state.inputsExpanded})}>
              <InputForm scenario={scenario} expanded={this.state.inputsExpanded}/>
            </TouchableOpacity>
          </ScrollView>
          : null
        }
        {this.state.initialized && retirementOutlook ?
          <Outlook navigator={this.props.navigator} retirementOutlook={retirementOutlook}/>
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
    const {onExampleExit} = this.props;

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: this.statics.title,
          component: MainScreen,
          passProps: {onExampleExit},
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'stretch',
    backgroundColor: 'green',
  },
  welcome: {
    fontSize: 20,
    fontFamily: 'Verdana',
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonText: {
    color: '#ff0000'
  },
  scenarioForm: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'stretch',
    //backgroundColor: '#0000ff'
  },
  scenarioFormRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  scenarioFormRowLabel: {
    flex: 0.4,
    textAlign: 'right'
  },
  scenarioFormRowInput: {
    flex: 0.4,
    fontSize: 13,
    padding: 4,
    color: 'blue'
  },
  outlook: {
    backgroundColor: 'white',
    //flex: .7,
    flexDirection: 'column',
    marginHorizontal: 10,
    //height: 300
    flex: .4
  },
  outlookRow: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    flexDirection: 'row'
  }
});

AppRegistry.registerComponent('EarlyRetireCalc', () => App);
