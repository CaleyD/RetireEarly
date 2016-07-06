import React, { PropTypes, Component } from 'react';
import {
  Text,
  Animated,
  TouchableHighlight,
  View,
  LayoutAnimation,
  ProgressViewIOS,
  ScrollView
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {SidebarInputTrigger} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import formatMoney from './formatMoney';
import store from './scenarioStore';
let SortableListView = require('react-native-sortable-listview');

class InitialPortfolioValueRow extends PureComponent {
  render() {
    let year = new Date().getYear() + 1900 + this.props.year;
    let {initialPortfolio} = this.props;
    return (
      <View style={[styles.progressRow, {borderTopColor: '#ccc', borderTopWidth: 1}]}>
        <Text style={styles.progressRowYear}>{year}</Text>
        <View style={{flex: 1}}>
          <SidebarInputTrigger
            value={initialPortfolio}
            onChange={(num)=>store.setInitialPortfolioValue(num)}
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
  initialPortfolio: PropTypes.number
};

class YearRow extends PureComponent {
  setNativeProps(props) {
    this._view.setNativeProps(props);
  }
  render() {
    let { year, portfolioValue, retirementPortfolio, onAddPeriod } = this.props;
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

class IncomeExpenseRowPlaceHolder extends PureComponent {
  render() {
    return (
      <View style={styles.incomeExpenseRow}>
        <TouchableHighlight onPress={()=>{
            store.insertIncomePeriod(this.props.year-1);
            this.props.onCancel();
          }}>
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
            <Ionicon name="ios-add-circle" color="#66f" style={styles.clickableIcon}/>
            <Text style={{flex: 1}}>Modify income/expenses</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.props.onCancel}>
          <Text>CANCEL</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

class IncomeExpenseRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {style: { height: new Animated.Value(45), overflow: 'hidden' }};
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
        <TouchableHighlight onPress={()=>this.delete()} style={styles.iconContainer}>
          <Ionicon name="ios-remove-circle" color="#F00" style={styles.clickableIcon} allowFontScaling={false}/>
        </TouchableHighlight>
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
        <TouchableHighlight  style={styles.iconContainer} underlayColor={'#eee'} {...this.props.sortHandlers}>
          <Ionicon name="ios-reorder" color="#999" style={styles.clickableIcon} allowFontScaling={false}/>
        </TouchableHighlight>
      );
    }
    return (
      <View style={styles.iconContainer}>
        <Ionicon name="ios-reorder" style={styles.clickableIconDisabled} allowFontScaling={false}/>
      </View>
    );
  }
  renderIncomeAndExpenses() {
    let {period} = this.props;
    let {annualIncome, annualSpending} = period;
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>

        {[{title: 'Income', field: 'annualIncome'},
          {title: 'Expenses', field: 'annualSpending'}
        ].map(({title, field})=>(
            <View style={styles.progressRowColumn} key={field}>
              <SidebarInputTrigger value={period[field]}
                onChange={(num)=>store.updateIncomePeriod(period, {[field]: num})}
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
            {Math.round(100 * (annualIncome-annualSpending)/annualIncome)}%
          </Text>
        </View>

      </View>
    );
  }
  delete() {
    // animate height to zero and then delete the item from the store
    Animated.timing(
      this.state.style.height,
      { toValue: 0, duration: 150 }
    ).start(() => store.removeIncomePeriod(this.props.period));
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
      data['y' + index] = { type: 'year', portfolioValue: entry, year: index + 1 };
      order.push('y' + index);
    });

    let currentYearNumber = 0;
    scenario.incomePeriods.forEach((period, index) => {
      let key = 'period' + index;
      data[key] = {type: 'period', period};
      order.splice(currentYearNumber, 0, key);
      currentYearNumber += (period.years || 0) + 1;
    });

    if(this.state.selectedYear != null) {
      data['new-period'] = { type: 'new-period', year: this.state.selectedYear };
      for(let i=0; i<order.length; ++i) {
        if(order[i] === 'y' + this.state.selectedYear) {
          order.splice(i-1, 0, 'new-period');
          break;
        }
      }
    }

    let incomeIndices = [];
    for(let i=0; i<order.length; ++i) {
      if(order[i].indexOf('period') === 0) {
        incomeIndices.push(i + 1);
      }
    }

    return { data, order, incomeIndices };
  }
  render() {
    let { scenario, outlook, hideDeleteAndReorder } = this.props;
    let { data, order, incomeIndices } = this.getDataSource();
    return (
      <SortableListView
        style={{flex: 1}} sortRowStyle={{opacity: 0.8}} scrollEnabled={true}
        data={data} order={order} stickyHeaderIndices={incomeIndices}
        onRowMoved={e => {
          let period = e.row.data.period;
          let destination = e.to;
          if(destination === 0) {
            store.moveIncomePeriodBeforeFirstPeriod(period);
          }
          // get previous period (null to move to first year)
          for(let i=e.to-1; i>=0; --i) {
            if(order[i].indexOf('period')===0) {
              store.moveIncomePeriodAfterAnotherPeriod(
                period, data[order[i]], e.to - i);
              return;
            }
          }
          store.moveIncomePeriodBeforeFirstPeriod(period);
          let referencePeriod = null;
          throw new Error(JSON.stringify(e))
          store.moveIncomPeriodToYearIndex(period, destination);
        }}
        renderHeader={()=><InitialPortfolioValueRow year={0} initialPortfolio={scenario.initialPortfolio} />}
        renderRow={rowData => {
          if(rowData.type === 'year') {
            return (
              <View>
              <TouchableHighlight
                onPress={()=>this.setState({selectedYear: rowData.year===this.state.selectedYear ? null : rowData.year})}>
                <YearRow {...rowData} retirementPortfolio={outlook.retirementPortfolio} />
              </TouchableHighlight>
            </View>);
          } else if(rowData.type === 'new-period') {
            return <IncomeExpenseRowPlaceHolder {...rowData} onCancel={()=>this.setState({selectedYear: null})}/>;
          }
          return <IncomeExpenseRow {...rowData} hideDeleteAndReorder={hideDeleteAndReorder}
            allowDelete={scenario.incomePeriods[0] !== rowData.period}/>;
        }}
      />);
  }
}
Progress.propTypes = {
  scenario: PropTypes.object.isRequired,
  outlook: PropTypes.object.isRequired,
  hideDeleteAndReorder: PropTypes.bool
};

export default Progress;
