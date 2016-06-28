import React, { Component, PropTypes } from 'react';
import ReactNative, {
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ScrollView,
  ListView,
  LayoutAnimation,
  ProgressViewIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import NativeMethodsMixin from 'NativeMethodsMixin';
import * as Animatable from 'react-native-animatable';
import NumberInput from './react-native-numberinput'
import QuickDollarInputSidebar from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';

var scenarioStore = require('./scenarioStore');
var calc = require('./calculator.js');
var formatMoney = require('./formatMoney.js').formatMoney;
var formatMoneyCompact = require('./formatMoney.js').formatMoneyCompact;

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class OutlookTablePageRow extends PureComponent {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        {this.renderYear()}
        <View style={{flex: .8/*, marginTop: 5, marginBottom: 5*/}}>
          {this.props.children}
        </View>
      </View>
    );
  }
  renderYear() {
    var year = new Date().getYear() + 1900 + this.props.year;
    return (
      // TODO: onpress => toggle display between year and age
      <View style={{flex: .15, paddingLeft: 15, paddingRight: 15}}>
        <Text style={{color: 'gray'}}>{year}</Text>
      </View>
    );
  }
}
OutlookTablePageRow.propTypes = {
  children: PropTypes.element.isRequired,
  year: PropTypes.number.isRequired
}

class OutlookTablePageIncomeExpenseRow extends PureComponent {
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
      <TouchableHighlight onPress={()=>{
          this.setState({selectedRow:!this.state.selectedRow})
        }}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            backgroundColor: rowSelected ? 'blue' : '#dddddd', overflow: 'hidden'}}>
          <View style={{flexDirection: 'row', flex: .8, marginTop: 5, marginBottom: 5}}>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Text>Income</Text>
              <NumberInput value={rowData.annualIncome} inputStyle={styles.scenarioFormRowInput}
                  onChange={(num)=>scenarioStore.updateIncomePeriod(rowData.period, {annualIncome: num})}
                  getFormattedText={formatMoney}
                  />
            </View>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Text>Expenses</Text>
              <NumberInput value={rowData.annualSpending} inputStyle={styles.scenarioFormRowInput}
                  onChange={(num)=>scenarioStore.updateIncomePeriod(rowData.period, {annualSpending: num})}
                  getFormattedText={formatMoney}
                  />
            </View>
            <View style={{flexDirection: 'column', flex: 1}}>
              <Text>Savings ratio</Text>
              <Text>{
                  Math.round(100 * (rowData.annualIncome-rowData.annualSpending)/rowData.annualIncome)}
                %
              </Text>
            </View>
          </View>
          {rowSelected ?
            <View style={{height: 300}}>
              {this.props.allowDelete ?
                <TouchableHighlight onPress={()=>scenarioStore.removeIncomePeriod(this.props.rowData.period)}>
                  <Icon name="rocket" size={30} color="#900" />
                </TouchableHighlight>
                :
                null
              }
            </View>
            :
            null
          }
        </View>
      </TouchableHighlight>
    );
  }
}

export default class OutlookTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentAge: 33,
      yearDisplay: 'year', // 'age'
      scenario: this.props.scenario
    }
    this.scenarioListener = scenarioStore.addListener('change',
      (scenario) => { this.setState({scenario})}
    );
  }

  componentWillUnmount() {
    this.scenarioListener.remove();
  }

  render() {
    var scenario = this.state.scenario;
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

    var datasource = ds.cloneWithRows(listItems);
    return (
      <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
        <View style={[styles.container, {backgroundColor: 'white', flex: .8}]}>
          <ListView
            enableEmptySections={true}
            dataSource={datasource}
            stickyHeaderIndices={incomeIndices}
            renderHeader={()=>
              <OutlookTablePageRow year={0}>
                <View style={{flexDirection: 'row', height: 44}}>
                  <Text>initial portfolio value</Text>
                  <NumberInput
                    inputStyle={[styles.scenarioFormRowInput, {flex: 1}]}
                    value={scenario.initialPortfolioValue}
                    getFormattedText={formatMoney}
                    onChange={(num)=>scenarioStore.setInitialPortfolioValue(num)}
                    />
                </View>
              </OutlookTablePageRow>
            }
            renderRow={(rowData) =>
              rowData.type === 'year' ?
                <View>
                  {this.state.selectedRow===rowData.year ?
                    <View>
                      <Text>Modify income/expenses</Text>
                    </View>
                    : null
                  }
                  <OutlookTablePageRow year={rowData.year}>
                    <TouchableHighlight onPress={()=>this.setState({selectedRow: rowData.year===this.state.selectedRow ? null : rowData.year})}>
                      <View style={{flexDirection: 'row'}}>
                        <ProgressViewIOS
                          style={{marginRight: 10, flex: 1, alignSelf: 'center'}}
                          progress={rowData.portfolioValue / retirementOutlook.retirementPortfolioValue}>
                        </ProgressViewIOS>
                        <Text style={{marginRight: 10}}>{formatMoneyCompact(rowData.portfolioValue)}</Text>
                        {/*
                        <Text>Change in portfolio: {formatMoney(rowData.portfolioValue)}</Text>
                        */}
                      </View>
                    </TouchableHighlight>
                  </OutlookTablePageRow>
                </View>
                :
                <OutlookTablePageIncomeExpenseRow rowData={rowData}
                  allowDelete={scenario.incomePeriods[0] !== rowData.period}/>
              }
            />

          <View
            style={{height: 50, backgroundColor: 'pink', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center'}}>
            <View style={{flex: 3, backgroundColor: 'green', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: 'white'}}>{Math.round(10*retirementOutlook.yearsToRetirement)/10} years</Text>
              <Text style={{color: 'white'}}>{formatMoney(retirementOutlook.retirementPortfolioValue)}</Text>
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
        {this.state.selectedRow ?
          <QuickDollarInputSidebar />
          : null
        }
      </View>
    );
  }
}
OutlookTablePage.propTypes = {
  scenario: PropTypes.object.isRequired
}
