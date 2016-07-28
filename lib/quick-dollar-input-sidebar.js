/*
todo:
* - swipe right to dismiss?
* - allow keyboard as alternate input?
*/
'use strict';
import React, { PropTypes, Component } from 'react';
import {
  Text, View, TouchableOpacity, LayoutAnimation, StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import formatMoney from './formatMoney';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Dial from 'react-native-dial';
const throttle = require('throttle-debounce/throttle');

let inputPanel;

class QuickDollarInputPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: undefined,
      onHide: undefined,
      onChange: undefined
    };
    inputPanel = this;
    this.throttledOnChange = throttle(50, () => {
      this.state.onChange(this._latestValue);
    });
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
    this.hide = this.hide.bind(this);
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
      onHide: onHide
    });
  }
  render() {
    let {value, visible} = this.state;
    return (
      <View style={visible ? styles.topViewVisible : styles.topViewHidden}>
        <Dial style={{flex: 1, marginVertical: 10, width: 140, height: 140, alignSelf: 'center'}}
          value={value}
          minimumValue={0} maximumValue={20000000}
          onValueChange={(num) => {
            this._latestValue = Math.round(num / 360 * 50) * 1000;
            this.throttledOnChange();
          }}
          />
        <TouchableOpacity onPress={this.hide} style={styles.dismissIconContainer}>
          <Icon name="arrow-with-circle-down" size={30} color="black"/>
        </TouchableOpacity>
      </View>
    );
  }
  hide() {
    if(this.props.onVisibilityChange) {
      this.props.onVisibilityChange(false);
    }
    if(this.state.onHide) {
      this.state.onHide();
    }
    this.setState({visible: false, onHide: null});
  }
  onSelect(num) {
    this.setState({value: num});
    this.state.onChange(num);
  }
}
QuickDollarInputPanel.propTypes = {
  onVisibilityChange: PropTypes.func
}

class SidebarInputTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: false};
    this.onPress = this.onPress.bind(this);
  }
  onPress() {
    if(this.state.selected) {
      return;
    }
    this.setState({selected: true});

    inputPanel.show({
      selectedValue: this.props.value,
      onChange: this.props.onChange,
      onHide: ()=> this.setState({selected: false}),
      maximumValue: this.props.maximumValue || 1000000
    });
  }
  componentWillUnmount() {
    if(this.state.selected) {
      inputPanel.hide();
    }
  }
  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
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

function SideBarContainer(props) {
  return (
    <View style={styles.container}>
      {props.children}
      <QuickDollarInputPanel onVisibilityChange={props.onVisibilityChange} />
    </View>
  );
}

export { SidebarInputTrigger, SideBarContainer };

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1
  },
  topViewVisible: {
    alignItems: 'stretch',
    height: 200,
    overflow: 'hidden',
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  topViewHidden: {
    alignItems: 'stretch',
    height: 0,
    overflow: 'hidden',
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  dismissIconContainer: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }
});
