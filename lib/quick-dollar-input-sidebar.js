/*
todo:
* - swipe right to dismiss?
* - allow keyboard as alternate input?
*/
'use strict';
import React, { PropTypes, Component } from 'react';
import {
  Text, View, TouchableOpacity, LayoutAnimation, StyleSheet, Slider
} from 'react-native';
import PureComponent from './pureComponent';
import Icon from 'react-native-vector-icons/Entypo';
import formatMoneyCompact from './formatMoney';
import PureRenderMixin from 'react-addons-pure-render-mixin';
const throttle = require('throttle-debounce/throttle');

let sidebarInput;

let simpleDollarAmounts = [];
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
for(var i=10000; i<=20000; i+=500) {
  simpleDollarAmounts.push(i*1000);
}

class VerticalSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let values = simpleDollarAmounts;
    return (
      <View style={{width: 60, marginVertical: 30}} onLayout={(e)=>{this.setState({layout: e.nativeEvent.layout})}}>
        {this.state.layout ?
          <Slider maximumTrackTintColor='black' minimumTrackTintColor='orange'
            {...this.props}
            style={{
              width: this.state.layout.height, height: 40,
              transform: [{rotate: '-90deg'}],
              marginLeft: -.5 * this.state.layout.height + 40,
              marginTop: this.state.layout.height * .5 - 20
            }}
            step={1 / values.length}
            value={values.indexOf(this.state.value) / values.length}
            onSlidingComplete={ num => {
              if(this.props.onSlidingComplete) {
                this.props.onSlidingComplete(values[Math.round(values.length * num)]);
              }
            }}
            onValueChange={ num => {
              if(this.props.onValueChange) {
                this.props.onValueChange(values[Math.round(values.length * num)]);
              }
            }}
            />
          :
          null
        }
      </View>
    );
  }
}

class QuickDollarInputSidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      values: [],
      onHide: undefined,
      onChange: undefined
    };
    sidebarInput = this;
    this.throttledOnChange = throttle(50, () => {
      const { values } = this.state;
      this.state.onChange(values[Math.round(this._latestValue*(values.length))]);
    });
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  show({selectedValue, onChange, onHide, maximumValue}) {
    if(this.state.onHide) {
      this.state.onHide();
    }
    if(this.props.onVisibilityChange) {
      this.props.onVisibilityChange(true);
    }

    this.setState({
      maximumValue: maximumValue,
      value: selectedValue,
      visible: true,
      onChange: onChange,
      onHide: onHide,
      values: simpleDollarAmounts.slice(0, simpleDollarAmounts.indexOf(maximumValue))
    });
  }
  render() {
    let {values} = this.state;
    return (
      <View
        style={this.state.visible ? styles.topViewVisible : styles.topViewHidden}>
        <View style={{flex: 1, marginVertical: 10}} onLayout={(e)=>{this.setState({layout: e.nativeEvent.layout})}}>
          {this.state.layout ?
            <Slider maximumTrackTintColor='black' minimumTrackTintColor='orange' style={{
                width: this.state.layout.height, height: 40,
                transform: [{rotate: '-90deg'}],
                marginLeft: -.5 * this.state.layout.height + 40,
                marginTop: this.state.layout.height * .5 - 20
              }}
              step={1 / values.length}
              value={values.indexOf(this.state.value) / values.length}
              onValueChange={(num) => {
                this._latestValue = num;
                this.throttledOnChange();
              }}
              />
            :
            null
          }
        </View>

        <TouchableOpacity onPress={()=>this.hide()} style={styles.dismissIconContainer}>
          <Icon name="arrow-with-circle-right" size={30} color="black"/>
        </TouchableOpacity>
      </View>
    );
  }
  hide() {
    this.setState({visible: false});
    if(this.props.onVisibilityChange) {
      this.props.onVisibilityChange(false);
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
  onVisibilityChange: PropTypes.func
}

class SidebarInputTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: false};
  }
  onPress() {
    if(this.state.selected) {
      return;
    }
    this.setState({selected: true});

    sidebarInput.show({
      selectedValue: this.props.value,
      onChange: this.props.onChange,
      onHide: ()=>this.setState({selected: false}),
      maximumValue: this.props.maximumValue || 1000000
    });
  }
  render() {
    return (
      <TouchableOpacity onPress={()=>this.onPress()}>
        {this.props.renderChildren(this.state.selected)}
      </TouchableOpacity>
    );
  }
}
SidebarInputTrigger.propTypes = {
  value: PropTypes.number,
  maximumValue: PropTypes.number,
  renderChildren: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

class SideBarContainer extends Component {
  render() {
    return (
      <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
        {this.props.children}
        <QuickDollarInputSidebar
          onVisibilityChange={(visible)=>this.setState({sideBarVisible: visible})} />
      </View>
    );
  }
}

export { SidebarInputTrigger, SideBarContainer, VerticalSlider };

const styles = StyleSheet.create({
  topViewVisible: {
    alignItems: 'stretch',
    width: 75,
    overflow: 'hidden'
  },
  topViewHidden: {
    alignItems: 'stretch',
    width: 0,
    overflow: 'hidden'
  },
  dismissIconContainer: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
});
