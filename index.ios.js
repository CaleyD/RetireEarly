/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  ScrollView,
  NavigatorIOS,
  StatusBar,
  ListView,
  PickerIOS
} from 'react-native';
var scenarioStore = require('./lib/scenarioStore');
var calc = require('./lib/calculator.js');
var formatMoney = require('./lib/formatMoney.js');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class InputFormDollarInputRow extends Component {
  constructor(props) {
    super(props);
    this.state = {value: (props.value || '').toString()};
  }
  render() {
    return (
      <View style={styles.scenarioFormRow}>
        <Text style={styles.scenarioFormRowLabel}>
          {this.props.labelText}:
        </Text>
        <TextInput style={styles.scenarioFormRowInput}
            maxLength={9} autoCorrect={false} keyboardType='number-pad'
            value={'$' + this.state.value.toString()}
            onChangeText={this.onChangeText.bind(this)}
            />
      </View>
    );
  }
  onChangeText(text) {
    if(text[0] === '$') { text = text.substr(1); }
    this.setState({value: text});
    if(this.props.onChangeText) {
      this.props.onChangeText(parseInt(text));
    }
  }
}
InputFormDollarInputRow.propTypes = {
  value: PropTypes.number.isRequired,
  labelText: PropTypes.string.isRequired
};

class InputFormPercentInputRow extends Component {
  constructor(props) {
    super(props);
    this.state = {value: props.value * 100};
  }
  render() {
    return (
      <View style={styles.scenarioFormRow}>
        <Text style={styles.scenarioFormRowLabel}>
          {this.props.labelText}:
        </Text>

        <TextInput style={styles.scenarioFormRowInput}
            maxLength={9} autoCorrect={false} keyboardType='number-pad'
            value={this.state.value.toFixed(2).toString() + '%'}
            onChangeText={this.onChangeText.bind(this)}
            />
      </View>
    );
  }
  onChangeText(text) {
    if(text.indexOf('%') >= 0) { text = text.replace('%', ''); }
    var num = Math.min(100, parseFloat(text));
    this.setState({value: num});
    if(this.props.onChangeText) {
      this.props.onChangeText(num / 100);
    }
  }
  GetPicker() {
    <PickerIOS style={{width: 300, height: 300}}
        selectedValue={this.props.value.toString()}
        >
      {Array(401).fill(1).map(function(el,i) {
        var value = i / 4;
        return <PickerIOS.Item key={value+''} value={value.toString()} label={value.toFixed(2)+'%'} />;
      })}
    </PickerIOS>
  }
}

class InputForm extends Component {
  render() {
    var scenario = this.props.scenario || {};
    return (
      <View style={styles.scenarioForm}>
        <InputFormDollarInputRow labelText='Initial Portfolio Value'
          value={scenario.initialPortfolioValue}
          onChangeText={(text)=>{this.onChange('initialPortfolioValue', text); }}/>
        <InputFormPercentInputRow labelText='Annual Return'
          value={scenario.annualReturn}
           onChangeText={(text)=>{this.onChange('annualReturn', text); }}/>
        <InputFormPercentInputRow labelText='Withdrawal Rate'
          value={scenario.withdrawalRate}
           onChangeText={(text)=>{this.onChange('withdrawalRate', text); }}/>
        <InputFormDollarInputRow labelText='Annual Income'
          value={scenario.annualIncome}
           onChangeText={(text)=>{this.onChange('annualIncome', text); }}/>
        <InputFormDollarInputRow labelText='Annual Spending'
          value={scenario.annualSpending}
           onChangeText={(text)=>{this.onChange('annualSpending', text); }}/>
      </View>
    );
  }
  onChange(propName, text) {
    var scenario = JSON.parse(JSON.stringify(this.props.scenario || {}));
    scenario[propName] = parseFloat(text);
    scenarioStore.setScenario(scenario);
  }
}

class Intro extends Component {
  render() {
    return (
      <View>
        <Text style={styles.welcome}>
          Early Retirement Calculator!
        </Text>
        <Text style={styles.instructions}>
          Shake for dev menu
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

        <TouchableHighlight style={styles.button}
            underlayColor='#99d9f4'
            onPress={()=>{this.props.navigator.push({
                title: "Path to Financial Independence",
                component: OutlookTablePage,
                backButtonTitle: 'back',
                passProps: {
                  toggleNavBar: this.props.toggleNavBar,
                  annualBalances: this.props.retirementOutlook.annualBalances
                }
              });
            }}
            >
          <Text style={styles.buttonText}>Go</Text>
        </TouchableHighlight>
        <OutlookTablePage annualBalances={this.props.retirementOutlook.annualBalances}/>
      </View>
    );
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
      <ListView
        dataSource={datasource}
        renderRow={this.renderRow}
        />
    );
  }
  renderRow(rowData, ignore, rowIndex) {
    return (
      <View style={styles.outlookRow}>
        <Text>{formatMoney(rowData.portfolioValue)}</Text>
        <Text style={{textAlign: 'right', flex: .4}}>after {rowData.years} {rowData.years === 1 ? 'year' : 'years'}</Text>
      </View>
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
        annualIncome: 100000,
        annualSpending: 45000
      }
    };
    scenarioStore.getScenario((err, scenario) => {
      this.setState({ scenario: scenario, initialized: true });
    });
    scenarioStore.onChange((scenario)=>this.onScenarioChanged(scenario));
  }

  onScenarioChanged(scenario) {
    this.setState({ scenario: JSON.parse(JSON.stringify(scenario)) });
  }

  render() {
    var scenario = this.state.scenario;

    var retirementOutlook = calc.calculate(
      scenario.annualIncome, scenario.annualSpending,
      scenario.initialPortfolioValue, scenario.annualReturn,
      scenario.withdrawalRate);

    // using ScrollView for dismiss keyboard functionality
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={false} style={{backgroundColor:'green'}}>

        <Intro/>

        {this.state.initialized ?
          <ScrollView>
            <InputForm scenario={scenario}/>
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
      description: 'iOS navigation capabilities',
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
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
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
    //height: 44
  },
  scenarioFormRowLabel: {
    flex: 0.4,
    textAlign: 'right',
    height: 44,
    paddingTop: 12
  },
  scenarioFormRowInput: {
    height: 44,
    flex: .4,
    fontSize: 13,
    padding: 4,
    color: 'blue'
  },
  outlook: {
    backgroundColor: 'white',
    //flex: .7,
    flexDirection: 'column',
    borderRadius: 10,
    margin: 20,
    height: 300
  },
  outlookRow: {
    //height: 30,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    flexDirection: 'row'
  }
});

AppRegistry.registerComponent('EarlyRetireCalc', () => App);
