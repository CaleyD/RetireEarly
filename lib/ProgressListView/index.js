/*
TODO: clean up old add rows objects
TODO: swipe to delete?
TODO: minimized/expanded view
*/
'use strict';
import React, { PropTypes, Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { movePeriod } from '../reducers/index.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import IncomeExpenseRowPlaceHolder from './IncomeExpenseRowPlaceholder.js';
import IncomeExpenseRow from './IncomeExpenseRow.js';
import YearRow from './YearRow.js';
import InitialPortfolioValueRow from './InitialPortfolioValueRow.js';
const SortableListView = require('../reacct-native-sortable-listview');

// todo: pull expand/collapse stuff into mixin with WeakSet

export default class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedAddRows: new Map()
    };
    this.onAddRowDismissed = year => {
      let expandedAddRows = new Map(this.state.expandedAddRows);
      expandedAddRows.set(year, 'collapsing');
      this.setState({ expandedAddRows });
    };
    this.openAddRow = year => {
      let expandedAddRows = new Map();
      for (var [key, value] of this.state.expandedAddRows) {
        expandedAddRows.set(key, 'collapsing');
      }
      expandedAddRows.set(year, 'open');
      this.setState({ expandedAddRows });
    };
    this.onAddRowCollapsed = year => {
      let expandedAddRows = new Map(this.state.expandedAddRows);
      expandedAddRows.delete(year);
      this.setState({ expandedAddRows });
    }
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  getDataSource() {
    const {scenario, outlook: {annualBalances = []}} = this.props;
    const source = this.__source = {data: {}, order: [], incomeIndices: []};
    const {data, order, incomeIndices} = source;

    if(typeof scenario.initialPortfolio !== 'number') {
      return source;
    }

    annualBalances.forEach((entry, year) => {
      // income row
      const period = scenario.incomePeriods[year];
      const incomeKey = 'i' + year;
      if(period) {
        // income row
        data[incomeKey] = {type: 'period', period};
        order.push(incomeKey);
        incomeIndices.push(order.length);
      } else if(this.state.expandedAddRows.has(year)) {
        // income placeholder row
        data[incomeKey] = { type: 'new-period', year: year };
        order.push(incomeKey);
      }

      // year row
      data[year] = { type: 'year', portfolioValue: entry, year: year };
      order.push(year);
    });

    // todo: collapse new row on reorder start

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
        renderHeader={()=>
          <InitialPortfolioValueRow initialPortfolio={scenario.initialPortfolio} dispatch={dispatch}/>
        }
        renderRow={rowData => {
          if(rowData.type === 'year') {
            return (
              <View>
                <TouchableOpacity onPress={()=>this.openAddRow(rowData.year)}>
                  <YearRow {...rowData} retirementPortfolio={outlook.retirementPortfolio} />
                </TouchableOpacity>
              </View>);
          } else if(rowData.type === 'new-period') {
            return (
              <IncomeExpenseRowPlaceHolder {...rowData} dispatch={dispatch}
                deleted={this.state.expandedAddRows.get(rowData.year) === 'collapsing'}
                onDismiss={this.onAddRowDismissed}/>
            );
          } else {
            return (
              <IncomeExpenseRow {...rowData} dispatch={dispatch}
                hideDeleteAndReorder={hideDeleteAndReorder}
                allowDelete={scenario.incomePeriods[0] !== rowData.period} />
            );
          }
        }}
      />);
  }
  onRowMoved(e) {
    const { dispatch } = this.props;
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
      if(order[i].indexOf('period') === 0) {
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
