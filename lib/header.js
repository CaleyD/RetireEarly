'use strict';
import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import PureComponent from './pureComponent';
import formatMoney from './formatMoney';
import { reset } from './reducers/index.js';

export default class Header extends PureComponent {
  render() {
    const { outlook, dispatch } = this.props;
    return (
      <View style={styles.pageHeader}>

        {typeof outlook.yearsToRetirement !== 'number' ?
          <Text style={styles.instructions}>Your path to financial independence</Text>
          :
          <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'white'}}>{Math.round(10*outlook.yearsToRetirement)/10} years</Text>
            <Text style={{color: 'white'}}>{formatMoney(outlook.retirementPortfolio)}</Text>
          </View>
        }

        <TouchableOpacity onPress={() => dispatch(reset())}>
          <Text style={styles.pageHeaderButton}>RESET</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
Header.propTypes = {
  outlook: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pageHeader: {
    paddingTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'green'
  },
  pageHeaderButton: {
    height: 44
  }
});
