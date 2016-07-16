'use strict';
import React, { PropTypes } from 'react';
import { Text, Animated, TouchableOpacity, View } from 'react-native';
import { addPeriod } from '../reducers/index.js';
import Ionicon from 'react-native-vector-icons/Ionicons';
import styles from '../styles.js';
import AnimateInOutRow from './AnimateInOutRow.js';

export default class IncomeExpenseRowPlaceHolder extends AnimateInOutRow {
  render() {
    const { dispatch, year, onCancel } = this.props;
    return (
      <Animated.View style={this.state.style}>
        <View style={[styles.incomeExpenseRow, {paddingHorizontal: 20}]}>
          <TouchableOpacity style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}} onPress={()=>{
              dispatch(addPeriod(1000, 1000, year-1));
              onCancel();
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
    this.animateOut(() => this.props.onCancel());
  }
}
