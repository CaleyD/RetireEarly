'use strict';
import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import formatMoney from './formatMoney';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default function Header({ outlook, dispatch, menuPressed }) {
  return (
    <View style={styles.pageHeader}>

      <TouchableOpacity onPress={() => menuPressed()} style={{paddingHorizontal: 8}}>
        <Ionicon name="md-menu" color="#FFF" style={{fontSize: 30, color: '#FFF'}} allowFontScaling={false}/>
      </TouchableOpacity>

      {typeof outlook.yearsToRetirement !== 'number' ?
        <Text style={styles.instructions}>Your path to financial independence</Text>
        :
        <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'white'}}>{Math.round(10*outlook.yearsToRetirement)/10} years</Text>
          <Text style={{color: 'white'}}>{formatMoney(outlook.retirementPortfolio)}</Text>
        </View>
      }
    </View>
  );
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
    backgroundColor: '#33cc33'
  }
});
