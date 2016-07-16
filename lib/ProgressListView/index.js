/*
TODO: clean up old add rows objects
TODO: swipe to delete?
TODO: minimized/expanded view
*/
'use strict';
import React, { PropTypes, Component } from 'react';
import {
  Text, Animated, TouchableOpacity, View, LayoutAnimation, ProgressViewIOS,
  ScrollView
} from 'react-native';
import {
  addPeriod, deletePeriod, movePeriod, setAnnualReturn, setWithdrawalRate,
  setInitialPortfolio, reset, editPeriod
} from '../reducers/index.js';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SidebarInputTrigger} from '../quick-dollar-input-sidebar';
import PureComponent from '../pureComponent';
import styles from '../styles.js';
import formatMoney from '../formatMoney';
import IncomeExpenseRowPlaceHolder from './IncomeExpenseRowPlaceholder.js';
import IncomeExpenseRow from './IncomeExpenseRow.js';
import YearRow from './YearRow.js';
import InitialPortfolioValueRow from './InitialPortfolioValueRow.js';
const SortableListView = require('../reacct-native-sortable-listview');

class Progress extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this._expandedRows = [];
    this.onCancelAddRow = ()=>this.setState({selectedYear: null});
  }
  getDataSource() {
    const {scenario, scenario: {incomePeriods}, outlook: {annualBalances = []}} = this.props;
    const source = this.__source = {data: {}, order: [], incomeIndices: []};
    const {data, order, incomeIndices} = source;

    if(typeof scenario.initialPortfolio !== 'number') {
      return source;
    }

    annualBalances.forEach((entry, index) => {
      data['y' + index] = { type: 'year', portfolioValue: entry, year: index + 1 };
      order.push('y' + index);
    });

    let offset = 0;
    incomePeriods.forEach((period, year) => {
      if(period) {
        const key = 'period' + year;
        data[key] = {type: 'period', period};
        order.splice(year + offset, 0, key);
        ++offset;
      }
    });

    if(this.state.selectedYear != null) {
      if(this._expandedRows.indexOf(this.state.selectedYear) < 0) {
        this._expandedRows.push(this.state.selectedYear);
      }

      const key = 'new-period' + this.state.selectedYear;
      data[key] = { type: 'new-period', year: this.state.selectedYear };
      for(let i=0; i<order.length; ++i) {
        if(order[i] === 'y' + this.state.selectedYear) {
          order.splice(i-1, 0, key);
          break;
        }
      }
    }

    // close old expanded rows
    this._expandedRows.forEach((year)=>{
      if(year !== this.state.selectedYear) {
        const key = 'new-period' + year;
        data[key] = { type: 'new-period', year: year, deleted: true };
        for(let i=0; i<order.length; ++i) {
          if(order[i] === 'y' + year) {
            order.splice(i-1, 0, key);
            break;
          }
        }
      }
    });

    // TODO: delete old expanded rows from array
    // todo: collapse new row on reorder start

    for(let i=0; i<order.length; ++i) {
      if(order[i].indexOf('period') === 0) {
        incomeIndices.push(i + 1);
      }
    }

    return source;
  }
  render() {
    const { scenario, outlook, hideDeleteAndReorder, dispatch } = this.props;
    const { data, order, incomeIndices } = this._source || this.getDataSource();
    return (
      <SortableListView
        automaticallyAdjustContentInsets={false}
        style={{flex: 1}} sortRowStyle={{opacity: 0.8}}
        contentContainerStyle={{paddingBottom: 50}}
        scrollEnabled={order.length > 2}
        data={data} order={order} stickyHeaderIndices={incomeIndices}
        onRowMoved={e => this.onRowMoved(e)}
        renderHeader={()=><InitialPortfolioValueRow initialPortfolio={scenario.initialPortfolio} dispatch={dispatch}/>}
        renderRow={rowData => {
          if(rowData.type === 'year') {
            return (
              <View>
                <TouchableOpacity
                  onPress={()=>this.setState({selectedYear: rowData.year===this.state.selectedYear ? null : rowData.year})}>
                  <YearRow {...rowData} retirementPortfolio={outlook.retirementPortfolio} />
                </TouchableOpacity>
              </View>);
          } else if(rowData.type === 'new-period') {
            return <IncomeExpenseRowPlaceHolder {...rowData} dispatch={dispatch} onCancel={this.onCancelAddRow}/>;
          }
          return <IncomeExpenseRow {...rowData} hideDeleteAndReorder={hideDeleteAndReorder}
            allowDelete={scenario.incomePeriods[0] !== rowData.period} dispatch={dispatch}/>;
        }}
      />);
  }
  onRowMoved(e) {
    const {dispatch} = this.props;
    const { data, order, incomeIndices } = this.__source;
    const period = e.row.data.period;
    const destination = e.to;

    this._source = this.__source;
    this._source.order.splice(e.to, 0, order.splice(e.from, 1)[0]);
    this.forceUpdate();
    setImmediate(()=>{
      this._source = null;
      dispatch(movePeriod(period, destination-1))
    });
    return

    if(destination === 0) {
      dispatch(movePeriod(period, 0));
    }
    // get previous period (null to move to first year)
    for(let i=e.to-1; i>=0; --i) {
      if(order[i].indexOf('period')===0) {
        dispatch(moveIncomePeriodAfterAnotherPeriod(
          period, data[order[i]], e.to - i));
        return;
      }
    }
    dispatch(moveIncomePeriodBeforeFirstPeriod(period));
    throw new Error(JSON.stringify(e))
    dispatch(moveIncomPeriodToYearIndex(period, destination));
  }
}
Progress.propTypes = {
  scenario: PropTypes.object.isRequired,
  outlook: PropTypes.object.isRequired,
  hideDeleteAndReorder: PropTypes.bool
};

export default Progress;
