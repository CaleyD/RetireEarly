'use strict';
import React, { PropTypes, Component } from 'react';
import {
  Text, Animated, TouchableOpacity, View, LayoutAnimation, ProgressViewIOS,
  ScrollView
} from 'react-native';
import {
  addPeriod, deletePeriod, movePeriod, setAnnualReturn, setWithdrawalRate,
  setInitialPortfolio, reset, editPeriod
} from './reducers/index.js';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SidebarInputTrigger} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import formatMoney from './formatMoney';
const SortableListView = require('./reacct-native-sortable-listview');

class InitialPortfolioValueRow extends PureComponent {
  render() {
    const year = new Date().getYear() + 1900 + this.props.year;
    const {initialPortfolio, dispatch} = this.props;
    return (
      <View style={[styles.progressRow, {borderTopColor: '#ccc', borderTopWidth: 1}]}>
        <Text style={styles.progressRowYear}>{year}</Text>
        <View style={{flex: 1}}>
          <SidebarInputTrigger
            value={initialPortfolio}
            onChange={(num)=>dispatch(setInitialPortfolio(num))}
            renderChildren={(selected)=>(
              <View style={{
                  alignItems: 'center',
                  height: 44,
                  backgroundColor: selected ? 'orange' : 'transparent',
                  flexDirection: 'row'}}>
                <Text style={{flex: 1}}>Initial portfolio value</Text>
                <Text style={styles.progressRowAmount}>{formatMoney(initialPortfolio)}</Text>
              </View>
            )}
            />
        </View>
      </View>
    );
  }
}
InitialPortfolioValueRow.propTypes = {
  year: PropTypes.number.isRequired,
  initialPortfolio: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

class YearRow extends PureComponent {
  setNativeProps(props) {
    this._view.setNativeProps(props);
  }
  render() {
     const { year, portfolioValue, retirementPortfolio, onAddPeriod } = this.props;
    return (
      <View style={[styles.progressRow, {height: 30}]} ref={(v)=>this._view=v}>
        <Text style={styles.progressRowYear}>{new Date().getYear() + 1900 + year}</Text>
        <ProgressViewIOS style={styles.progressBar}
          progress={portfolioValue / retirementPortfolio}/>
        <Text style={styles.progressRowAmount}>{formatMoney(portfolioValue)}</Text>
      </View>
    );
  }
}
YearRow.propTypes = {
  year: PropTypes.number.isRequired
}

class AnimateInOutRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {style: { height: new Animated.Value(0), overflow: 'hidden' }};
  }
  animateIn(callback) {
    Animated.timing(
      this.state.style.height,
      { toValue: 45, duration: 150 }
    ).start(callback);
  }
  animateOut(callback) {
    Animated.timing(
      this.state.style.height,
      { toValue: 0, duration: 150 }
    ).start(callback);
  }
  componentDidMount() {
    this.animateIn();
  }
  componentDidUpdate() {
    if(this.props.deleted) {
      this.animateOut();
    } else {
      this.animateIn();
    }
  }
}

class IncomeExpenseRowPlaceHolder extends AnimateInOutRow {
  render() {
    const {dispatch, year, onCancel} = this.props;
    return (
      <Animated.View style={this.state.style}>
        <View style={styles.incomeExpenseRow}>
          <TouchableOpacity onPress={()=>{
              dispatch(addPeriod(1000, 1000, year-1));
              onCancel();
            }}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
              <Ionicon name="ios-add-circle" color="#66f" style={styles.clickableIcon}/>
              <Text style={{flex: 1}}>Modify income/expenses</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.onCancel()}>
            <Text>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  onCancel() {
    this.animateOut(() => this.props.onCancel());
  }
}

class IncomeExpenseRow extends AnimateInOutRow {
  constructor(props) {
    super(props);
    this.state = {style: { height: new Animated.Value(46), overflow: 'hidden' }};
  }
  render() {
    return (
      <Animated.View style={this.state.style}>
        <View style={styles.incomeExpenseRow}>
          {this.renderSorter()}
          {/*<ScrollView horizontal={true} style={{flex: 1, flexDirection: 'row', height: 44}}>*/}
            {this.renderIncomeAndExpenses()}
          {/*}</ScrollView>*/}
          {this.renderDeleteIcon()}
        </View>
      </Animated.View>
    );
  }
  renderDeleteIcon() {
    if(this.props.hideDeleteAndReorder) {
      return null;
    }
    return (this.props.allowDelete ?
        <TouchableOpacity onPress={()=>this.delete()} style={styles.iconContainer}>
          <Ionicon name="ios-remove-circle" color="#F00" style={styles.clickableIcon} allowFontScaling={false}/>
        </TouchableOpacity>
        :
        <View style={styles.iconContainer}>
          <Ionicon name="ios-remove-circle" style={styles.clickableIconDisabled} allowFontScaling={false}/>
        </View>
      );
  }
  renderSorter() {
    if(this.props.hideDeleteAndReorder) {
      return null;
    }
    if(this.props.allowDelete) {
      return (
        <TouchableOpacity  style={styles.iconContainer} underlayColor={'#eee'} {...this.props.sortHandlers}>
          <Ionicon name="ios-reorder" color="#999" style={styles.clickableIcon} allowFontScaling={false}/>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.iconContainer}>
        <Ionicon name="ios-reorder" style={styles.clickableIconDisabled} allowFontScaling={false}/>
      </View>
    );
  }
  renderIncomeAndExpenses() {
    const {period, dispatch} = this.props;
    const {income, expenses} = period;
    return (
      <View style={{flex: 1, flexDirection: 'row' }}>

        {[{title: 'Income', field: 'income', max: 500000},
          {title: 'Expenses', field: 'expenses', max: 100000}
        ].map(({title, field, max})=>(
            <View style={styles.progressRowColumn} key={field}>
              <SidebarInputTrigger value={period[field]} maximumValue={max}
                onChange={(num)=>this.editPeriod(field, num)}
                renderChildren={(selected)=>(
                  <View style={selected ?
                      styles.progressRowColumnSelected : styles.progressRowColumn}>
                    <Text style={styles.incomeExpenseLabel}>{title}</Text>
                    <Text style={styles.incomeExpenseValue}>{formatMoney(period[field])}</Text>
                  </View>
                )}/>
            </View>
          ))
        }

        <View style={styles.progressRowColumn}>
          <Text style={styles.incomeExpenseLabel}>Savings rate</Text>
          <Text style={styles.incomeExpenseValue}>
            {Math.round(100 * (income-expenses)/income)}%
          </Text>
        </View>

      </View>
    );
  }
  editPeriod(field, num) {
    this.props.dispatch(editPeriod(this.props.period, {[field]: num}))
  }
  delete() {
    // animate height to zero and then delete the item from the store
    this.animateOut(() => this.props.dispatch(deletePeriod(this.props.period)));
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
    this._expandedRows = [];
  }
  getDataSource() {
    const {scenario, scenario: {incomePeriods}, outlook: {annualBalances = []}} = this.props;
    let source = this.__source = {data: {}, order: [], incomeIndices: []};
    let {data, order, incomeIndices} = source;

    if(typeof scenario.initialPortfolio !== 'number') {
      return source;
    }

    annualBalances.forEach((entry, index) => {
      data['y' + index] = { type: 'year', portfolioValue: entry, year: index + 1 };
      order.push('y' + index);
    });

    let offset = 0;
    incomePeriods.forEach((period, year) => {
      let key = 'period' + year;
      data[key] = {type: 'period', period};
      order.splice(year + offset, 0, key);
      ++offset;
    });

    if(this.state.selectedYear != null) {
      if(this._expandedRows.indexOf(this.state.selectedYear) < 0) {
        this._expandedRows.push(this.state.selectedYear);
      }

      let key = 'new-period' + this.state.selectedYear;
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
        let key = 'new-period' + year;
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
        scrollEnabled={order.length > 2}
        data={data} order={order} stickyHeaderIndices={incomeIndices}
        onRowMoved={e => this.onRowMoved(e)}
        renderHeader={()=><InitialPortfolioValueRow year={0} initialPortfolio={scenario.initialPortfolio} dispatch={dispatch}/>}
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
            return <IncomeExpenseRowPlaceHolder {...rowData} dispatch={dispatch} onCancel={()=>this.setState({selectedYear: null})}/>;
          }
          return <IncomeExpenseRow {...rowData} hideDeleteAndReorder={hideDeleteAndReorder}
            allowDelete={scenario.incomePeriods[0] !== rowData.period} dispatch={dispatch}/>;
        }}
      />);
  }
  onRowMoved(e) {
    const {dispatch} = this.props;
    let { data, order, incomeIndices } = this.__source;
    let period = e.row.data.period;
    let destination = e.to;

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
