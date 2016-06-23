import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ScrollView
} from 'react-native';
const formatMoneyCompact = require('./formatMoney').formatMoneyCompact;

const simpleDollarAmounts = [
  1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000,
  13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000,

  100000, 105000, 110000, 115000, 120000, 125000, 130000, 135000, 140000,

  150000, 160000, 170000, 180000, 190000, 200000,

  225000, 250000, 275000, 300000, 325000, 350000, 375000, 400000, 425000,
  450000, 475000, 500000, 525000, 550000, 575000, 600000, 625000, 650000,
  675000, 700000, 725000, 750000, 775000, 800000, 825000, 850000, 875000,
  900000, 925000, 950000, 975000, 1000000,
  1050000, 1100000
]

export default class QuickDollarInputSidebar extends Component {
  render() {
    return (
      <ScrollView style={{flex:.2, backgroundColor: 'orange', flexDirection: 'column'}}>
        {/*
        <Picker style={{alignSelf: 'stretch', height: 500, backgroundColor: 'pink', marginTop: 50}}
          onValueChange={(lang) => this.setState({language: lang})}>
          {simpleDollarAmounts.map((amount)=>
            <Picker.Item label={formatMoneyCompact(amount)} value={amount} key={amount}/>
          )}
        </Picker>

          <Slider style={{transform: [{rotate: '270deg'}, {'translate':[0,0,1]}], position: 'absolute', width: 400, height: 30, right: 0, top: 0, bottom: 0}}/>
          */}
          {simpleDollarAmounts.map((amount)=>
            <View key={amount} style={{padding: 8}}>
              <Text style={{alignSelf:'center'}}>{formatMoneyCompact(amount)}</Text>
            </View>
          )}
      </ScrollView>
    );
  }
}
