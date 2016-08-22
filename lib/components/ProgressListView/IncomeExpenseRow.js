'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, Animated, TouchableOpacity, View } from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { SidebarInputTrigger } from '../quick-dollar-input-sidebar';
import styles from '../../styles.js';
import formatMoney from '../../formatMoney';
import { AnimateInOutMixin } from './AnimateInOut.js';

class DeleteAndSortRow extends AnimateInOutMixin(Component) {
  constructor(props) {
    super(props);
    this.state = {style: { height: new Animated.Value(46), overflow: 'hidden' }};
  }
  render() {
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
  delete() {
    // animate height to zero and then delete the item from the store
    this.animateOut(this.props.onDelete);
  }
}

export default class IncomeExpenseRow extends AnimateInOutMixin(Component) {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render() {
    return (
      <DeleteAndSortRow deleted={this.props.deleted}
        sortHandlers={this.props.sortHandlers}
        onDelete={()=>{this.props.onDeletePeriod(this.props.period)}}
        hideDeleteAndReorder={this.props.hideDeleteAndReorder}
        allowDelete={this.props.allowDelete}>
        {this.renderIncomeAndExpenses()}
      </DeleteAndSortRow>
    );
  }
  renderIncomeAndExpenses() {
    const {period} = this.props;
    const {income, expenses} = period;
    return (
      <View style={{flex: 1, flexDirection: 'row' }}>

        {[{title: 'Income', field: 'income', max: 5000000},
          {title: 'Expenses', field: 'expenses', max: 5000000}
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
    this.props.onEditPeriod(this.props.period, {[field]: num});
  }
}
IncomeExpenseRow.propTypes = {
  period: PropTypes.object.isRequired,
  hideDeleteAndReorder: PropTypes.bool,
  allowDelete: PropTypes.bool,
  onDeletePeriod: PropTypes.func.isRequired,
  onEditPeriod: PropTypes.func.isRequired
}
