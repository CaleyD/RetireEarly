'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, Animated, TouchableOpacity, View } from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { addPeriod } from '../reducers/index.js';
import Ionicon from 'react-native-vector-icons/Ionicons';
import styles from '../styles.js';
import AnimateInOutMixin from './AnimateInOutMixin.js';

export default class IncomeExpenseRowPlaceHolder extends AnimateInOutMixin(Component) {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render() {
    const { dispatch, year, onDismiss } = this.props;
    return (
      <Animated.View style={this.state.style}>
        <View style={[styles.incomeExpenseRow, {paddingHorizontal: 20}]}>
          <TouchableOpacity style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}} onPress={()=>{
              dispatch(addPeriod(undefined, undefined, year-1));
              onDismiss();
            }}>
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
              <View style={{justifyContent: 'center'}}><Ionicon name="ios-add-circle" color="#66f" style={styles.clickableIcon}/></View>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}><Text style={{textAlign: 'center'}}>Modify income/expenses</Text></View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.onCancel()}>
            <Text style={{alignSelf: 'flex-end'}}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  onCancel() {
    this.animateOut(() => this.props.onDismiss());
  }
}
