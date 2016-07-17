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
import { AnimateInOut } from './AnimateInOut.js';

// todo: pull expand/collapse stuff into mixin with WeakSet

// tri-state
class ExclusiveExpandableGroup {
  constructor(onChange) {
    this.items = new Map();
    this.onChange = onChange || (() => {});
  }
  has(key) {
    return !!this.items.get(key);
  }
  isExpanded(key) {
    return this.items.get(key) === 'expanded';
  }
  isCollapsed(key) {
    return this.items.get(key) === 'collapsed';
  }
  expand(key) {
    let dirty = false;
    for (let [existingKey] of this.items) {
      if(this.items.get(existingKey) !== 'collapsed') {
        this.items.set(existingKey, 'collapsed');
        dirty = true;
      }
    }
    if(this.items.get(key) !== 'expanded') {
      this.items.set(key, 'expanded');
      dirty = true;
    }
    if(dirty) {
      this.onChange();
    }
  }
  collapse(key) {
    if(this.items.get(key) !== 'collapsed') {
      this.items.set(key, 'collapsed');
      this.onChange();
    }
  }
  delete(key) {
    if(this.items.has(key)) {
      this.items.delete(key);
      this.onChange();
    }
  }
}

export default class Progress extends Component {
  constructor(props) {
    super(props);
    this.expandableGroup = new ExclusiveExpandableGroup(
      ()=>this.forceUpdate()
    );

    // onItemUIRemoved(key)
    // onItemRemovalRequest(key)
    // removeAll()
    // getState()
    this.onAddRowDismissed = year => {
      this.expandableGroup.collapse(year);
    };
    this.openAddRow = year => {
      this.expandableGroup.expand(year);
    };
    // TODO: unused method
    this.onAddRowCollapsed = year => {
      this.expandableGroup.delete(year);
    };

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
      } else if(this.expandableGroup.has(year)) {
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
        renderHeader={() =>
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
              <AnimateInOut deleted={this.expandableGroup.isCollapsed(rowData.year)}
                onDeleteAnimationComplete={this.onAddRowCollapsed}>
                <IncomeExpenseRowPlaceHolder {...rowData} dispatch={dispatch}
                  onDismiss={this.onAddRowDismissed}/>
              </AnimateInOut>
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
