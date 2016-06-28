import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableHighlight
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
const formatMoneyCompact = require('./formatMoney').formatMoneyCompact;

var simpleDollarAmounts = [];
for(var i=0; i<50; ++i) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=50; i<150; i+=5) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=150; i<300; i+=10) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=300; i<1000; i+=25) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=1000; i<2000; i+=50) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=2000; i<10000; i+=100) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=10000; i<50000; i+=500) {
  simpleDollarAmounts.push(i*1000);
}for(var i=50000; i<=100000; i+=1000) {
  simpleDollarAmounts.push(i*1000);
}

export default class QuickDollarInputSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsDisplayed: 71,
      scrollViewHeight: 0
    };
  }
  render() {
    return (
      <View
        style={{flex:.2,
          shadowColor: "#000000",
          shadowOpacity: 0.8,
          shadowRadius: 2,
          shadowOffset: {
            height: 1,
            width: 0
          }}}>
        {/* Picker won't work because they are fixed height on iOS!
            I could try a slider rotated 90 degrees
          */}
        <ScrollView
          onLayout={(event) => {
            this.setState({scrollViewHeight: event.nativeEvent.layout.height});
          }}
          style={{backgroundColor: 'orange', flexDirection: 'column'}}>
          <View style={{height: this.state.scrollViewHeight/3}}/>

          {simpleDollarAmounts.slice(0, this.state.rowsDisplayed).map((amount)=>
            <TouchableHighlight key={amount} underlayColor='grey'
              style={{padding: 8}} onPress={()=>{}}>
              <Text style={{alignSelf:'center', color: 'white'}}>{formatMoneyCompact(amount)}</Text>
            </TouchableHighlight>
          )}
          <TouchableHighlight onPress={()=>this.setState({rowsDisplayed: this.state.rowsDisplayed + 50})}>
            <Icon name="dots-three-horizontal" size={30} color="white" style={{alignSelf: 'center'}}/>
          </TouchableHighlight>

          <View style={{height: this.state.scrollViewHeight/3}}/>
        </ScrollView>

        <TouchableHighlight onPress={()=>{}}>
          <Icon name="dial-pad" size={30} color="black" style={{alignSelf: 'center', marginTop: 5}}/>
        </TouchableHighlight>
      </View>
    );
  }
}
