'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, Animated, TouchableOpacity, View } from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Ionicon from 'react-native-vector-icons/Ionicons';
import styles from './styles.js';
import formatMoney from '../../../formatMoney';
import { AnimateInOutMixin } from './AnimateInOut.js';
import { connect } from 'react-redux';
import { navigatePush } from '../../../reducers/navigation.js';

class DeleteAndSortRow extends AnimateInOutMixin (Component) {
  constructor (props) {
    super(props);
    this.state = {
      style: { height: new Animated.Value(46), overflow: 'hidden' }
    };
  }
  render () {
    return (
      <Animated.View style={this.state.style}>
        <View style={styles.incomeExpenseRow}>
          {this.renderSorter()}
          {this.props.children}
          {this.renderDeleteIcon()}
        </View>
      </Animated.View>
    );
  }
  renderDeleteIcon () {
    return this.props.allowDelete ?
      <TouchableOpacity
        onPress={()=>this.delete()}
        style={styles.iconContainer}
        >
        <Ionicon name="ios-remove-circle" color="#F00"
          style={styles.clickableIcon} allowFontScaling={false}/>
      </TouchableOpacity>
      :
      <View style={styles.iconContainer}>
        <Ionicon name="ios-remove-circle" style={styles.clickableIconDisabled}
          allowFontScaling={false}/>
      </View>;
  }
  renderSorter () {
    if (this.props.allowDelete) {
      return (
        <TouchableOpacity  style={styles.iconContainer}
          underlayColor={'#eee'} {...this.props.sortHandlers}>
          <Ionicon name="ios-reorder" color="#999"
            style={styles.clickableIcon} allowFontScaling={false}/>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.iconContainer}>
        <Ionicon name="ios-reorder"
          style={styles.clickableIconDisabled} allowFontScaling={false}/>
      </View>
    );
  }
  delete () {
    // animate height to zero and then delete the item from the store
    this.animateOut(this.props.onDelete);
  }
}

class IncomeExpenseRow extends AnimateInOutMixin(Component) {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render () {
    return (
      <DeleteAndSortRow deleted={this.props.deleted}
        sortHandlers={this.props.sortHandlers}
        onDelete={()=>{this.props.onDeletePeriod(this.props.period);}}
        allowDelete={this.props.allowDelete}>
        {this.renderIncomeAndExpenses()}
      </DeleteAndSortRow>
    );
  }
  renderIncomeAndExpenses () {
    const {period, yearIndex, showEditPeriod} = this.props;
    const {income, expenses} = period;
    return (
      <View style={{flex: 1, flexDirection: 'row' }}>

        {[{title: 'Income', propName: 'income'},
          {title: 'Expenses', propName: 'expenses'}
        ].map(({title, propName})=>
            <View style={styles.progressRowColumn} key={propName}>
              <TouchableOpacity
                onPress={()=>showEditPeriod({yearIndex, propName})}>
                <View style={styles.progressRowColumn}>
                  <Text style={styles.incomeExpenseText}>{title}</Text>
                  <Text style={styles.incomeExpenseText}>
                    {formatMoney(period[propName])}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }

        <View style={styles.progressRowColumn}>
          <Text style={styles.incomeExpenseText}>Savings rate</Text>
          <Text style={styles.incomeExpenseText}>
            {Math.round(100 * (income - expenses) / income)}%
          </Text>
        </View>

      </View>
    );
  }
}
IncomeExpenseRow.propTypes = {
  period: PropTypes.object.isRequired,
  yearIndex: PropTypes.number.isRequired,
  allowDelete: PropTypes.bool,
  onDeletePeriod: PropTypes.func.isRequired,
  showEditPeriod: PropTypes.func.isRequired
};

export default connect(
  ({scenario}, props) => ({
    yearIndex: scenario.incomePeriods.indexOf(props.period)
  }),
  {
    showEditPeriod: (options) => navigatePush({
      key: 'QuickEditPanel',
      title: 'Income Period',
      ...options
    })
  }
)(IncomeExpenseRow);
