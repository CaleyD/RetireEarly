'use strict';
import React, { PropTypes, Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { addPeriod } from '../../reducers/index.js';
import Ionicon from 'react-native-vector-icons/Ionicons';
import styles from '../../styles.js';

export default class IncomeExpenseRowPlaceHolder extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
    this.onCancel = () => this.props.onDismiss(this.props.year);
    this.onAdd = () => {
      this.props.dispatch(addPeriod(undefined, undefined, this.props.year));
      this.props.onDismiss(this.props.year);
    };
  }
  render() {
    return (
      <View style={[styles.incomeExpenseRow, {paddingHorizontal: 20}]}>

        <TouchableOpacity style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}
          onPress={this.onAdd}>
          <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
            <View style={{justifyContent: 'center'}}>
              <Ionicon name="ios-add-circle" color="#66f" style={styles.clickableIcon}/>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'stretch'}}>
              <Text style={{textAlign: 'center'}}>Modify income/expenses</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onCancel}>
          <Text style={{alignSelf: 'flex-end'}}>CANCEL</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
IncomeExpenseRowPlaceHolder.propTypes = {
  year: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired
};
