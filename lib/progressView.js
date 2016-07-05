import React, { PropTypes, Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  LayoutAnimation,
  ProgressViewIOS
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SidebarInputTrigger} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';

let scenarioStore = require('./scenarioStore');
import formatMoney from './formatMoney';

let SortableListView = require('react-native-sortable-listview');

class ProgressRow extends PureComponent {
  render() {
    let year = new Date().getYear() + 1900 + this.props.year;
    return (
      <View style={styles.progressRow}>
        <Text style={styles.progressRowYear}>{year}</Text>
        <View style={{flex: 1}}>
          {this.renderContents()}
        </View>
      </View>
    );
  }
  renderContents() {
    return null;
  }
}
ProgressRow.propTypes = {
  year: PropTypes.number.isRequired
}

class InitialPortfolioValueRow extends ProgressRow {
  render() {
    return (
      <View style={{backgroundColor: '#fff', borderTopColor: '#ccc', borderTopWidth: 1}}>
        {super.render()}
      </View>
    );
  }
  renderContents() {
    // TODO - allow negative values for people in debt starting out
    let {initialPortfolioValue} = this.props;
    return (
      <SidebarInputTrigger
        value={initialPortfolioValue}
        onChange={(num)=>scenarioStore.setInitialPortfolioValue(num)}
        renderChildren={(selected)=>(
          <View style={{
              alignItems: 'center',
              height: 44,
              backgroundColor: selected ? 'orange' : 'transparent',
              flexDirection: 'row'}}>
            <Text style={{flex: 1}}>Initial portfolio value</Text>
            <Text style={styles.progressRowAmount}>{formatMoney(initialPortfolioValue)}</Text>
          </View>
        )}
        />
    );
  }
}

class YearRow extends ProgressRow {
  renderContents() {
    let {year, portfolioValue, retirementPortfolioValue} = this.props;
    return (
      <TouchableHighlight onPress={()=>this.setState({selectedRow: year===this.state.selectedRow ? null : year})}>
        <View style={{flexDirection: 'row', height: 30, alignItems: 'center'}}>
          <ProgressViewIOS
            style={{marginRight: 10, flex: 1, alignSelf: 'center'}}
            progress={portfolioValue / retirementPortfolioValue}>
          </ProgressViewIOS>
          <Text style={styles.progressRowAmount}>{formatMoney(portfolioValue)}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

/*
class IncomeExpenseRowPlaceHolder extends PureComponent {
  render() {
    return (
      <TouchableHighlight onPress={()=>{
        scenarioStore.insertIncomePeriod(this.props.rowData.year-1);
      }}>
        <View style={styles.incomeExpenseRow}>
          <Icon name="plus-square-o" size={24} color="#AAA" />
          <Text>Modify income/expenses</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
*/

class IncomeExpenseRow extends PureComponent {
  render() {
    let {period} = this.props;
    let {annualIncome, annualSpending} = period;

    return (
      <View style={styles.incomeExpenseRow}>

        {this.renderSorter()}

        {[{title: 'Income', field: 'annualIncome'},
          {title: 'Expenses', field: 'annualSpending'}
          ].map((item)=>(
            <View style={styles.progressRowColumn} key={item.field}>
              <SidebarInputTrigger value={period[item.field]}
                onChange={(num)=>{
                  let attrs = {};
                  attrs[item.field] = num;
                  scenarioStore.updateIncomePeriod(period, attrs);
                }}
                renderChildren={(selected)=>(
                  <View style={selected ?
                      styles.progressRowColumnSelected : styles.progressRowColumn}>
                    <Text>{item.title}</Text>
                    <Text>{formatMoney(period[item.field])}</Text>
                  </View>
                )}/>
            </View>
          ))
        }

        <View style={styles.progressRowColumn}>
          <Text>Savings rate</Text>
          <Text>
            {Math.round(100 * (annualIncome-annualSpending)/annualIncome)}%
          </Text>
        </View>

        {this.renderDeleteIcon()}
      </View>
    );
  }
  renderDeleteIcon() {
    if(this.props.hideDeleteAndReorder) {
      return null;
    }
    return (this.props.allowDelete ?
        <TouchableHighlight onPress={()=>scenarioStore.removeIncomePeriod(this.props.period)}>
          <Ionicon name="ios-remove-circle" size={28} color="#F00"/>
        </TouchableHighlight>
        :
        <Ionicon name="ios-remove-circle" size={28} color="#CCC"/>
      );
  }
  renderSorter() {
    if(this.props.hideDeleteAndReorder) {
      return null;
    }
    if(this.props.allowDelete) {
      return (
        <TouchableHighlight underlayColor={'#eee'} style={{width: 44, height: 30}}
          {...this.props.sortHandlers}>
          <Ionicon name="ios-reorder" size={30} color="#999"/>
        </TouchableHighlight>
      );
    }
    return <Ionicon name="ios-reorder" size={30} color="#BBB"/>;
  }
}
IncomeExpenseRow.propTypes = {
  period: PropTypes.object.isRequired,
  hideDeleteAndReorder: PropTypes.bool,
  allowDelete: PropTypes.bool
}

class Progress extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getDataSource() {
    let {scenario, outlook} = this.props;
    let data = {};
    let order = [];
    outlook.annualBalances.forEach((entry, index) => {
      let key = 'year' + (index + 1);
      data[key] = { type: 'year', portfolioValue: entry, year: index + 1 };
      order.push(key);
    });
    let incomeIndices = [];

    var currentYearNumber = 0;
    scenario.incomePeriods.forEach((period, index) => {
      let key = 'period' + index;
      data[key] = {type: 'period', period};
      order.splice(currentYearNumber, 0, key);
      incomeIndices.push(currentYearNumber + 1);
      currentYearNumber += (period.years || 0) + 1;
    });
/*
    if(this.state.selectedRow) {
      let selectedRow = listItems[2*(this.state.selectedRow-1)];
      if(selectedRow.status !== 'populated') {
        selectedRow.status = 'new';
      }
    }
*/
    return {data, order, incomeIndices};
  }
  render() {
    let {scenario, outlook, hideDeleteAndReorder} = this.props;
    let {data, order, incomeIndices} = this.getDataSource();
    return (
      <SortableListView
        sortRowStyle={{opacity: 0.8}}
        scrollEnabled={true}
        stickyHeaderIndices={incomeIndices}
        style={{flex: 1}}
        data={data}
        order={order}
        onRowMoved={e => {
          let period = data[order[e.from]];
          let destination = e.to;
          scenarioStore.moveIncomPeriodToYearIndex(period, destination);
        }}
        renderHeader={()=><InitialPortfolioValueRow year={0} initialPortfolioValue={scenario.initialPortfolioValue} />}
        renderRow={rowData => (rowData.type === 'year') ?
          <YearRow {...rowData} retirementPortfolioValue={outlook.retirementPortfolioValue}/>
          :
          <IncomeExpenseRow {...rowData} hideDeleteAndReorder={hideDeleteAndReorder}
            allowDelete={scenario.incomePeriods[0] !== rowData.period}/>
          }
      />);
  }
}
Progress.propTypes = {
  scenario: PropTypes.object.isRequired,
  outlook: PropTypes.object.isRequired,
  hideDeleteAndReorder: PropTypes.bool
};

export default Progress;
