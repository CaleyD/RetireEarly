import React, { PropTypes } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  ListView,
  LayoutAnimation,
  ProgressViewIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {QuickDollarInputSidebar} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';

var scenarioStore = require('./scenarioStore');
var calc = require('./calculator.js');
import formatMoneyCompact from './formatMoney';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var sidebarInput;

class ProgressRow extends PureComponent {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        {this.renderYear()}
        <View style={{flex: 1/*, marginTop: 5, marginBottom: 5*/}}>
          {this.props.children}
        </View>
      </View>
    );
  }
  renderYear() {
    var year = new Date().getYear() + 1900 + this.props.year;
    return (
      // TODO: onpress => toggle display between year and age
      <View style={{ paddingLeft: 15, paddingRight: 15}}>
        <Text style={{color: 'gray'}}>{year}</Text>
      </View>
    );
  }
}
ProgressRow.propTypes = {
  children: PropTypes.element.isRequired,
  year: PropTypes.number.isRequired
}

class IncomeExpenseRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {selectedRow: false};
  }
  componentWillUpdate() {
    LayoutAnimation.spring();
  }
  render() {
    rowData = this.props.rowData;
    rowSelected = this.state.selectedRow;
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
          backgroundColor: rowSelected ? 'blue' : '#dddddd', overflow: 'hidden'}}>
        <View style={{flexDirection: 'row', flex: .8, marginTop: 5, marginBottom: 5}}>

          {
            [
              {title: 'Income', field: 'annualIncome'},
              {title: 'Expenses', field: 'annualSpending'},
            ].map((item)=>(
              <TouchableHighlight key={item.field}
                onPress={()=>{
                  if(this.state.selectedField===item.field) {
                    return;
                  }
                  this.setState({selectedField: item.field});
                  sidebarInput.show(
                    rowData[item.field],
                    (num)=>{
                      var attrs = {};
                      attrs[item.field] = num;
                      scenarioStore.updateIncomePeriod(rowData.period, attrs);
                    },
                    ()=>this.setState({selectedField: null})
                  );
                }}
                style={{flexDirection: 'row', height: 44}}>
                <View style={{flexDirection: 'column', flex: 1, alignItems: 'center',
                    backgroundColor: this.state.selectedField===item.field ? 'orange' : 'transparent'}}
                  >
                  <Text>{item.title}</Text>
                  <Text>{formatMoneyCompact(rowData[item.field])}</Text>
                </View>
              </TouchableHighlight>
            ))
          }

          <View style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
            <Text>Savings ratio</Text>
            <Text>{
                Math.round(100 * (rowData.annualIncome-rowData.annualSpending)/rowData.annualIncome)}
              %
            </Text>
          </View>

          <TouchableHighlight onPress={()=>scenarioStore.removeIncomePeriod(this.props.rowData.period)}>
            <Icon name="rocket" size={30} color="#900" />
          </TouchableHighlight>

        </View>
      </View>
    );
  }
}

class Progress extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedField: undefined
    };
  }
  getDataSource() {
    var scenario = this.props.scenario;
    var retirementOutlook = calc.calculate(scenario);
    var annualBalances = retirementOutlook.annualBalances;
    var listItems = annualBalances.map(function(entry, index) {
      return { type: 'year', portfolioValue: entry, year: index + 1 };
    });
    incomeIndices = [];

    var currentYearNumber = 0;
    scenario.incomePeriods.forEach((period) => {
      listItems.splice(currentYearNumber, 0, {
        type: 'income/expenses',
        annualIncome: period.annualIncome, annualSpending: period.annualSpending,
        period: period
      });
      incomeIndices.push(++currentYearNumber);
      currentYearNumber += (period.years || 0);
    });

    return ds.cloneWithRows(listItems);
  }
  render() {
    var scenario = this.props.scenario;
    var retirementOutlook = this.props.retirementOutlook;

    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.getDataSource()}
        stickyHeaderIndices={incomeIndices}
        renderHeader={()=>this.renderInitialPortfolioValueRow()}
        renderRow={(rowData) =>
          rowData.type === 'year' ?
            <View>
              {this.state.selectedRow===rowData.year ?
                <TouchableHighlight onPress={()=>{
                  this.setState({selectedRow: null});
                  scenarioStore.insertIncomePeriod(rowData.year-1, {annualIncome: 0, annualSpending: 0});
                }}>
                  <View>
                    <Text>Modify income/expenses</Text>
                  </View>
                </TouchableHighlight>
                : null
              }
              <ProgressRow year={rowData.year}>
                <TouchableHighlight onPress={()=>this.setState({selectedRow: rowData.year===this.state.selectedRow ? null : rowData.year})}>
                  <View style={{flexDirection: 'row'}}>
                    <ProgressViewIOS
                      style={{marginRight: 10, flex: 1, alignSelf: 'center'}}
                      progress={rowData.portfolioValue / retirementOutlook.retirementPortfolioValue}>
                    </ProgressViewIOS>
                    <Text style={{marginRight: 10}}>{formatMoneyCompact(rowData.portfolioValue)}</Text>
                  </View>
                </TouchableHighlight>
              </ProgressRow>
            </View>
            :
            <IncomeExpenseRow rowData={rowData}
              allowDelete={scenario.incomePeriods[0] !== rowData.period}/>
          }
      />
    );
  }
  renderInitialPortfolioValueRow() {
    // TODO - allow negative values for people in debt starting out
    let initialPortfolioValue = this.props.scenario.initialPortfolioValue;
    var isSelected = this.state.selectedField === 'initialPortfolioValue';
    return (
      <ProgressRow year={0}>
        <TouchableHighlight
          onPress={()=>{
            if(isSelected) {
              return;
            }
            this.setState({selectedField: 'initialPortfolioValue'});
            sidebarInput.show(
              initialPortfolioValue,
              (num)=>scenarioStore.setInitialPortfolioValue(num),
              ()=>this.setState({selectedField: null})
            );
          }}
          >
          <View style={{height: 44, backgroundColor: isSelected ? 'orange' : 'transparent'}}>
            <Text>initial portfolio value</Text>
            <Text>{formatMoneyCompact(initialPortfolioValue)}</Text>
          </View>
        </TouchableHighlight>
      </ProgressRow>
    );
  }
}
Progress.propTypes = {
  scenario: PropTypes.object.isRequired,
  retirementOutlook: PropTypes.object.isRequired
};

export default class OutlookTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scenario: null
    }
    scenarioStore.getScenario((err, scenario) => this.setState({scenario}));
    this.scenarioListener = scenarioStore.addListener('change',
      (scenario) => { this.setState({scenario})}
    );
  }

  componentWillUnmount() {
    this.scenarioListener.remove();
  }

  render() {
    var scenario = this.state.scenario;

    if(scenario == null) {
      // scenario not yet loaded
      return <View />
    }

    var retirementOutlook = calc.calculate(scenario);

    return (
      <View style={{flexDirection: 'column', flex:1}}>

        <View>
          <View>
            <Text style={styles.welcome}>Early Retirement Calculator!</Text>
            <Text style={styles.instructions}>Your path to financial independence</Text>
          </View>

          <TouchableHighlight onPress={()=>scenarioStore.resetScenario()}>
            <Text style={{height: 44}}>RESET</Text>
          </TouchableHighlight>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
          <View style={[styles.container, {backgroundColor: 'white', flex: .8}]}>

            <Progress scenario={scenario} retirementOutlook={retirementOutlook}/>

            <View style={{
                height: 50, backgroundColor: 'pink', flexDirection: 'row',
                alignItems: 'stretch', justifyContent: 'center'
              }}>

              <View style={{flex: 3, backgroundColor: 'green', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white'}}>{Math.round(10*retirementOutlook.yearsToRetirement)/10} years</Text>
                <Text style={{color: 'white'}}>{formatMoneyCompact(retirementOutlook.retirementPortfolioValue)}</Text>
              </View>
              <View style={{
                  position: 'absolute', right: 30, bottom: 30,
                  flex: 2, backgroundColor: 'white', borderTopWidth: 1,
                  alignItems: 'center', justifyContent: 'center'
                }}>
                <Text>Widthdrawal rate: 4%</Text>
                <Text>Inflation 3.4%</Text>

              </View>
            </View>
          </View>

          <QuickDollarInputSidebar
            ref={(ctl)=>sidebarInput = ctl}
            onSelect={(num)=>scenarioStore.setInitialPortfolioValue(num)}/>
        </View>

        <MarketAssumptions style={{height: 100}} scenario={scenario}/>

      </View>
    );
  }
}
