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
import PureRenderMixin from 'react-addons-pure-render-mixin';
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

class InputFormInputRow extends PureComponent {
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
                ref={(c) => this._input = c }
                onFocus={this.inputFocused.bind(this)}
                />
              : this.props.type === 'percent' ?
            <TextInput style={styles.scenarioFormRowInput}
                maxLength={7} autoCorrect={false} keyboardType='decimal-pad'
                value={this.formatPercent(this.state.value)}
                onChangeText={this.onChangePercentText.bind(this)}
                ref={(c) => this._input = c }
                onFocus={this.inputFocused.bind(this)}
                />
              :
            <TextInput style={styles.scenarioFormRowInput}
                maxLength={2} autoCorrect={false} keyboardType='number-pad'
                value={this.state.value.toString()}
                onChangeText={this.onChangeDollarText.bind(this)}
                ref={(c) => this._input = c }
                onFocus={this.inputFocused.bind(this)}
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
    var num = parseInt(text) || 0;
    this.setState({value: num});
    this.props.onChange(num);
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
  constructor(props) {
    super(props);
    shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    var incomePeriod = this.props.earningPeriod;
    return (
      <View style={[styles.card, {marginBottom: 0}]}>

        <View style={[styles.cardHeader, {flexDirection: 'row'}]}>
          <Text style={{flex: .4}}>
            Earning period {this.props.index===0 && !this.props.allowDelete ? '' : this.props.index + 1}
          </Text>
          {this.props.allowDelete ?
            <TouchableHighlight underlayColor='#99d9f4' onPress={()=>this.removePeriod()}>
                <Text style={{flex: .4, textAlign:'right'}}>Remove</Text>
            </TouchableHighlight>
            : null
          }
        </View>

        <InputFormInputRow labelText='Annual Income' type='dollar'
          value={incomePeriod.annualIncome} expanded={this.props.expanded}
          onChange={(num)=>this.onChange('annualIncome', num)}/>
        <InputFormInputRow labelText='Annual Spending' type='dollar'
          value={incomePeriod.annualSpending} expanded={this.props.expanded}
          onChange={(num)=>this.onChange('annualSpending', num)}
          inputRefName={'annualSpending'+this.props.index}/>

        {!this.props.finalEarningPeriod ?
          <InputFormInputRow labelText='Years' type='years'
            value={incomePeriod.years} expanded={this.props.expanded}
            onChange={(num)=>this.onChange('years', num)}/>
          :
          null
        }
      </View>
    );
  }
  onChange(propName, num) {
    if(this.props.earningPeriod[propName] != num) {
      var earningPeriod = JSON.parse(JSON.stringify(this.props.earningPeriod));
      earningPeriod[propName] = num;
      this.props.onChange(earningPeriod);
    }
  }
  removePeriod() {
    this.props.onRemove();
  }
}
EarningPeriod.propTypes = {
  index: PropTypes.number.isRequired,
  finalEarningPeriod: PropTypes.bool.isRequired,
  allowDelete: PropTypes.bool.isRequired,
  earningPeriod: PropTypes.object.isRequired,
  scenario: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

// TODO: refactor - components not technically PURE because of this variable!
var scrollView;

class InputForm extends PureComponent {
  render() {
    var scenario = this.props.scenario;
    var incomePeriods = scenario.incomePeriods;
    return (
      <ScrollView alwaysBounceVertical={false} ref={(c) => scrollView = c}>
        <View style={styles.scenarioForm}>
          {/* TODO - allow negative values for people in debt starting out */}
          <View style={[styles.card, styles.rounded]}>
            {this.renderRow('initialPortfolioValue', 'Initial Portfolio Value', 'dollar')}
          </View>

          <View style={[styles.card, styles.rounded]}>
            <View style={[styles.cardHeader, styles.roundedTop]}>
              <Text style={{ backgroundColor: 'transparent' }}>Market Assumptions</Text>
            </View>
            {/* TODO - add horizontal scrolling options for: conservative, moderate, aggressive */}
            {this.renderRow('annualReturn', 'Annual Return', 'percent')}
            {this.renderRow('withdrawalRate', 'Withdrawal Rate', 'percent')}
          </View>

          <View style={styles.rounded}>
          {incomePeriods.map((incomePeriod, index) =>
            <EarningPeriod key={index} expanded={this.props.expanded}
              scenario={scenario} earningPeriod={incomePeriod} index={index}
              allowDelete={incomePeriods.length > 1}
              finalEarningPeriod={index === incomePeriods.length-1}
              onChange={(earningPeriod) => {
                scenarioStore.setScenario(update(scenario, {
                  incomePeriods: {
                    $splice: [[index, 1, earningPeriod]]
                  }
                }));
              }}
              onRemove={() => {
                scenarioStore.setScenario(update(this.props.scenario, {
                  incomePeriods: {
                    $splice: [[index, 1]]
                  }
                }));
              }}
              />
            )}
            <View style={styles.card}>

              <TouchableHighlight underlayColor='#99d9f4'
                  onPress={()=> {
                    var latestPeriod = incomePeriods[incomePeriods.length-1];

                    let newScenario = update(scenario, {
                      incomePeriods: {$splice: [[incomePeriods.length-1, 1,
                        {
                          annualIncome: latestPeriod.annualIncome,
                          annualSpending: latestPeriod.annualSpending,
                          years: 1
                        },
                        {
                          annualIncome: latestPeriod.annualIncome,
                          annualSpending: latestPeriod.annualSpending
                        }]]}
                    });
                    scenarioStore.setScenario(newScenario);
                  }}>
                  <View style={[styles.button, {marginBottom: 4, marginHorizontal: 4}]}>
                    <Text style={styles.buttonText}>Add earning period</Text>
                  </View>
              </TouchableHighlight>
            </View>
          </View>
          <View>
            <Text>Retirement Annual Expenses</Text>
          </View>
        </View>
      </ScrollView>
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
    var command = {};
    command[propName] = { $set: num };
    scenarioStore.setScenario(update(this.props.scenario, command));
  }
}
InputForm.propTypes = {
  scenario: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired
};

class Intro extends PureComponent {
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

class Outlook extends PureComponent {
  render() {
    var yearsToRetirement = Math.round(10 * this.props.retirementOutlook.yearsToRetirement) / 10;
    return (
      <TouchableHighlight underlayColor='#99d9f4'
        onPress={()=>this.navigateToDetails()}>
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
          annualBalances: this.props.retirementOutlook.annualBalances
        }
      });
  }
}

class OutlookTablePage extends PureComponent {
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

    var retirementOutlook = calc.calculate(scenario);

    // using ScrollView for dismiss keyboard functionality
    return (
      <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}
          style={{backgroundColor:'green'}}>

        <Intro/>

        {this.state.initialized ?
          <InputForm scenario={scenario} expanded={true}/>
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
  card: {
    backgroundColor: '#dddddd',
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5
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
    paddingTop: 13,
    textAlign: 'right',
    backgroundColor: 'rgba(52,52,52,0)'
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
    //flexDirection: 'column',
    marginHorizontal: 10,
    padding: 7,
    //height: 40,
    //flex: .4
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
