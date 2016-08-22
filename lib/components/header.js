'use strict';
import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import formatMoney from '../formatMoney';
import { toggleViewExpanded, toggleMarketAssumptions } from '../reducers/ui.js';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const calc = require('../calculator.js');

function Header({ outlook, toggleViewExpanded, toggleMarketAssumptions, menuPressed, viewExpanded }) {
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

      <TouchableOpacity onPress={toggleMarketAssumptions} style={{paddingHorizontal: 8}}>
        <Ionicon name="md-options" color="#FFF" style={{fontSize: 24}}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleViewExpanded} style={{paddingHorizontal: 8}}>
        <FontAwesome name={viewExpanded ? "compress" : "expand"} color="#FFF" style={{fontSize: 24, color: '#FFF'}} allowFontScaling={false}/>
      </TouchableOpacity>

    </View>
  );
}
Header.propTypes = {
  outlook: PropTypes.object.isRequired,
  viewExpanded: PropTypes.bool.isRequired,
  menuPressed: PropTypes.func.isRequired,
  toggleViewExpanded: PropTypes.func.isRequired,
  toggleMarketAssumptions: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  pageHeader: {
    paddingTop: 25,
    height: 55,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#33cc33'
  }
});

export default connect(
  ({ui, scenario}) => ({
    viewExpanded: ui.expanded,
    outlook: calc.calculate(scenario)
  }),
  { toggleViewExpanded, toggleMarketAssumptions }
)(Header);
