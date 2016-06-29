/*
* onSelect: function(newValue){}
todo:
* - highlight the selected value
* - scroll to selected value on mount
* - fire event on value update
* - swipe right to dismiss?
* - dismiss button
* - allow keyboard as alternate input?
*/

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  LayoutAnimation
} from 'react-native';

import PureComponent from './pureComponent';
import Icon from 'react-native-vector-icons/Entypo';
import formatMoneyCompact from './formatMoney';

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
}
for(var i=50000; i<=100000; i+=1000) {
  simpleDollarAmounts.push(i*1000);
}

class InputRow extends PureComponent {
  render() {
    return (
      <TouchableHighlight underlayColor='grey'
        style={{padding: 8, backgroundColor: this.props.selected ? 'green' : 'transparent'}}
        onPress={()=>{this.props.onSelect(this.props.amount)}}>
        <Text style={{alignSelf:'center', color: 'white'}}>
          {formatMoneyCompact(this.props.amount)}
        </Text>
      </TouchableHighlight>
    );
  }
}
InputRow.propTypes = {
  onSelect: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  selected: PropTypes.bool
}

export default class QuickDollarInputSidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rowsDisplayed: 71,
      scrollViewHeight: 0,
      visible: false
    };
  }
  componentWillUpdate() {
    LayoutAnimation.spring();
  }
  show(selectedValue, onChange, onHide) {
    this.setState({
      value: selectedValue,
      visible: true,
      onChange: onChange,
      onHide: onHide
    });
  }
  render() {
    return (
      <View
        style={{
          flex:this.state.visible ? .2 : 0,
          width: this.state.visible ? undefined: 0,
          shadowColor: "#000000",
          shadowOpacity: 0.8,
          shadowRadius: 2,
          shadowOffset: {
            height: 1,
            width: 0
          }}}>
        {/* Picker won't work because they are fixed height on iOS!
            I could try a slider rotated 90 degrees though...
          */}
        <ScrollView
          onLayout={(event) => {
            this.setState({scrollViewHeight: event.nativeEvent.layout.height});
          }}
          style={{backgroundColor: 'orange', flexDirection: 'column',
            paddingTop: this.state.scrollViewHeight/3,
            paddingBottom: this.state.scrollViewHeight/3
          }}>

          {simpleDollarAmounts.slice(0, this.state.rowsDisplayed).map((amount)=>
            <InputRow amount={amount} selected={amount===this.state.value}
              onSelect={(num)=>this.onSelect(num)} key={amount}
              />
          )}
          <TouchableHighlight onPress={()=>this.setState({rowsDisplayed: this.state.rowsDisplayed + 50})}>
            <Icon name="dots-three-horizontal" size={30} color="white" style={{alignSelf: 'center'}}/>
          </TouchableHighlight>

        </ScrollView>

        <TouchableHighlight onPress={()=>this.hide()}>
          <Icon name="arrow-with-circle-right" size={30} color="black" style={{alignSelf: 'center', marginTop: 5}}/>
        </TouchableHighlight>
      </View>
    );
  }
  hide() {
    this.setState({visible: false});
    if(this.props.onHide) {
      this.props.onHide();
    }
    if(this.state.onHide) {
      this.state.onHide();
    }
  }
  onSelect(num) {
    this.setState({value: num});
    this.state.onChange(num);
  }
}

QuickDollarInputSidebar.propTypes = {
  onHide: PropTypes.func
};
