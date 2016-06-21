import React, { Component, PropTypes } from 'react';
import ReactNative, {
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
  Picker,
  Switch
} from 'react-native';
import NativeMethodsMixin from 'NativeMethodsMixin';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as Animatable from 'react-native-animatable';
var update = require('react-addons-update');

var scenarioStore = require('./lib/scenarioStore');
var calc = require('./lib/calculator.js');
var formatMoney = require('./lib/formatMoney.js');

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class PureComponent extends Component {
  constructor(props) {
    super(props);
    shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
}

class NumberInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: props.value || 0};
  }
  render() {
    var val = this.state.focused || !this.props.getFormattedText?
      this.state.value.toString() :
      this.props.getFormattedText(this.state.value);
    return (
      <TextInput style={styles.scenarioFormRowInput}
          maxLength={9} autoCorrect={false} keyboardType='number-pad'
          value={val}
          onChangeText={this.onChange.bind(this)}
          onBlur={() => this.setState({focused: false})}
          ref={(c) => this._input = c }
          onFocus={this.inputFocused.bind(this)}
          />
    );
  }
  onChange(text) {
    var num = parseInt(text) || 0;
    this.setState({value: num});
    this.props.onChange(num);
  }
  inputFocused() {
    this.setState({focused: true})
    if(this.props.scrollview) {
      setTimeout(() => {
        let scrollResponder = this.props.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          ReactNative.findNodeHandle(this._input),
          110, //additionalOffset
          true
        );
      }, 50);
    }
  }
}
NumberInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  scrollview: PropTypes.object,
  getFormattedText: PropTypes.func
}

class InputFormInputRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {value: (props.value || '').toString()};
  }
  render() {
    return (
      <View style={[styles.scenarioFormRow, {height: 44}]}>
        <Text style={styles.scenarioFormRowLabel}>{this.props.labelText}</Text>
        {(this.props.type === 'dollar' ?
          <NumberInput value={parseInt(this.state.value)}
              onChange={(num)=>{
                this.setState({value: num});
                this.props.onChange(num);
              }}
              scrollview={scrollView}
              getFormattedText={(num)=>formatMoney(num)}
              />
            : this.props.type === 'percent' ?
          <NumberInput value={parseInt(this.state.value)}
              onChange={(num)=>{
                this.setState({value: num});
                this.props.onChange(num);
              }}
              scrollview={scrollView}
              getFormattedText={(num)=>this.formatPercent(num)}
              />
            :
          <NumberInput value={parseInt(this.state.value)}
              onChange={(num)=>{
                this.setState({value: num});
                this.props.onChange(num);
              }}
              scrollview={scrollView}
              />
        )
        }
      </View>
    );
  }
  formatPercent(value) {
    return (value * 100).toFixed(2) + '%'
  }
  onChangePercentText(text) {
    if(text.indexOf('%') >= 0) { text = text.replace('%', ''); }
    var num = Math.min(100, parseFloat(text));
    this.setState({value: num / 100});
    this.props.onChange(num / 100);
  }
  inputFocused(refName) {
    setTimeout(() => {
      let scrollResponder = scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        ReactNative.findNodeHandle(this._input),
        110, //additionalOffset
        true
      );
    }, 50);
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
    if(incomePeriod[propName] != num) {
      var newIncomePeriod = JSON.parse(JSON.stringify(incomePeriod));
      newIncomePeriod[propName] = num;
      var index = this.props.scenario.incomePeriods.indexOf(incomePeriod);
      scenarioStore.setScenario(update(this.props.scenario, {
        incomePeriods: {
          $splice: [[index, 1, newIncomePeriod]]
        }
      }));
    }
  }
  updateIncomePeriod(incomePeriod, index, prop, num) {
    scenarioStore.setScenario(update(this.props.scenario, {
      incomePeriods: {
        $splice: [[index, 1, earningPeriod]]
      }
    }));
  }
  removePeriod(periodComponent, incomePeriod) {
    NativeMethodsMixin.measure.call(periodComponent, (a,b,c,height) => {
      periodComponent.transition({height}, {height: 0}, 300);
      setTimeout(()=>{
        scenarioStore.setScenario(update(this.props.scenario, {
          incomePeriods: {
            $splice: [[this.props.scenario.incomePeriods.indexOf(incomePeriod), 1]]
          }
        }));
      }, 300);
    });

    this._renderID++; // so deleted/animated-out rows don't get reused
  }
  addPeriod() {
    var incomePeriods = this.props.incomePeriods;
    var latestPeriod = incomePeriods[incomePeriods.length-1];

    scenarioStore.setScenario(update(this.props.scenario, {
      incomePeriods: {$splice: [[incomePeriods.length-1, 1,
        {
          annualIncome: latestPeriod.annualIncome,
          annualSpending: latestPeriod.annualSpending,
          years: 1
        },
        {
          annualIncome: latestPeriod.annualIncome,
          annualSpending: latestPeriod.annualSpending
        }]]
      }
    }));
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
          onChange={(num)=>this.onChange('annualReturn', num)}/>
        <InputFormInputRow labelText='Withdrawal Rate' type='percent'
          value={this.props.scenario.withdrawalRate}
          onChange={(num)=>this.onChange('withdrawalRate', num)}/>
      </View>
    );
  }
}
MarketAssumptions.propTypes = {
  scenario: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
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
            onChange={(num)=>this.onChange('initialPortfolioValue', num)}/>
        </View>

        <EarningPeriodListView incomePeriods={scenario.incomePeriods} scenario={scenario}/>

        <MarketAssumptions scenario={scenario} onChange={this.onChange.bind(this)}/>

      </View>
    );
  }
  onChange(propName, num) {
    var command = {};
    command[propName] = { $set: num };
    scenarioStore.setScenario(update(this.props.scenario, command));
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
          annualBalances: this.props.retirementOutlook.annualBalances,
          scenario: this.props.scenario
        }
      });
  }
}

class OutlookTablePageRow extends PureComponent {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        {this.renderYear()}
        {this.renderMarker()}
        <View style={{flex: .8, marginTop: 5, marginBottom: 5}}>
          {this.props.children}
        </View>
      </View>
    );
  }
  renderYear() {
    var year = new Date().getYear() + 1900 + this.props.year;
    return (
      // TODO: onpress => toggle display between year and age
      <View style={{flex: .15, paddingLeft: 15, paddingRight: 15, paddingTop: 20, paddingBottom: 20}}>
        <Text style={{color: 'gray'}}>{year}</Text>
      </View>
    );
  }
  renderMarker() {
    return (
      <View style={{width: 14, flexDirection: 'column', alignSelf: 'stretch',
        alignItems: 'center', justifyContent: 'center',
        marginRight: 20}}>
        <View style={{backgroundColor: this.props.year===0 ? 'white': 'green', width: 2, flex: 1, height: 1}} />
        <View style={{backgroundColor: 'green',
          borderRadius: 13, borderWidth: 0, borderColor: '#dddddd',
          height: 26, width: 26, justifyContent: 'center', overflow: 'hidden'}}>
          <Text allowFontScaling={false} style={{alignSelf: 'center', color: 'white',
            backgroundColor: 'transparent', flexWrap: 'nowrap'}}>{this.props.year}</Text>
        </View>
        <View style={{backgroundColor: 'green', width: 2, flex: 1, height: 1}}/>
      </View>
    );
  }
}
OutlookTablePageRow.propTypes = {
  children: PropTypes.element.isRequired,
  year: PropTypes.number.isRequired
}

class OutlookTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentAge: 33,
      yearDisplay: 'year' // 'age'
    }
  }
  render() {
    var listItems = this.props.annualBalances.map(function(entry, index) {
      return { type: 'year', portfolioValue: entry, year: index + 1 };
    });
    incomeIndices = [];

    var currentYearNumber = 0;
    this.props.scenario.incomePeriods.forEach((period) => {
      listItems.splice(currentYearNumber, 0, {
        type: 'income/expenses',
        annualIncome: period.annualIncome, annualSpending: period.annualSpending
      });
      incomeIndices.push(++currentYearNumber);
      currentYearNumber += (period.years || 0);
    });

    var datasource = ds.cloneWithRows(listItems);
    return (
      <View style={[styles.container, {backgroundColor: 'white'}]}>
        <ListView enableEmptySections={true}
          dataSource={datasource}
          stickyHeaderIndices={incomeIndices}
          renderHeader={()=>
            <OutlookTablePageRow year={0}>
              <View>
                <Text>initial portfolio value: {formatMoney(this.props.scenario.initialPortfolioValue)}</Text>
              </View>
            </OutlookTablePageRow>
          }
          renderRow={(rowData) =>
            rowData.type === 'year' ?
              <View style={{flexDirection: 'column'}}>
                <OutlookTablePageRow year={rowData.year}>
                  <View>
                    <Text>{formatMoney(rowData.portfolioValue)}</Text>
                    {/*
                    <Text>Change in portfolio: {formatMoney(rowData.portfolioValue)}</Text>
                    <Text>Change in portfolio: {formatMoney(rowData.portfolioValue)}</Text>
                    */}
                  </View>
                </OutlookTablePageRow>
              </View>
              :
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: '#dddddd'}}>
                <View style={{flex: .15, paddingLeft: 15, paddingRight: 15}}></View>
                <View style={{width: 14, flexDirection: 'column', alignSelf: 'stretch',
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 10}}>
                  <View style={{backgroundColor: 'green', width: 2, flex: 1, height: 1}}/>
                </View>
                <View style={{flex: .8, marginTop: 5, marginBottom: 5}}>
                  <Text>Income: {formatMoney(rowData.annualIncome)}</Text>
                  <Text>Expenses: {formatMoney(rowData.annualSpending)}</Text>
                  <Text>Savings ratio: {
                      Math.round(100 * (rowData.annualIncome-rowData.annualSpending)/rowData.annualIncome)}
                    %
                  </Text>
                </View>
              </View>
            }
          />

        <View
          style={{height: 50, backgroundColor: 'pink', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center'}}>
          <View style={{flex: 3, backgroundColor: 'green', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'white'}}>76.5 years</Text>
            <Text style={{color: 'white'}}>$1,234,000</Text>
          </View>
          <View style={{flex: 2, backgroundColor: 'white', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Widthdrawal rate: 4%</Text>
            <Text>Inflation 3.4%</Text>
          </View>
        </View>
      </View>
    );
  }
}
OutlookTablePage.propTypes = {
  scenario: PropTypes.object.isRequired,
  annualBalances: PropTypes.array.isRequired
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
      }
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

    var retirementOutlook = calc.calculate(scenario);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'green',
    alignItems: 'stretch'
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
  button: {
    flex: .4,
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  scenarioForm: {
    flex: 1,
    justifyContent: 'center'
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
  outlook: {
    backgroundColor: 'white',
    padding: 7,
    alignSelf: 'stretch'
  },
  outlookRow: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    flexDirection: 'row'
  },
  roundedTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  },
  roundedBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  },
  rounded: {
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  }
});

AppRegistry.registerComponent('EarlyRetireCalc', () => App);
