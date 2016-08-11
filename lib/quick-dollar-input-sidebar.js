/*
todo:
* - swipe down to dismiss?
* - allow keyboard as alternate input?
*/
'use strict';
import React, { PropTypes, Component } from 'react';
import {
  View, TouchableOpacity, LayoutAnimation, StyleSheet, PanResponder
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Dial from 'react-native-dial';
const throttle = require('throttle-debounce/throttle');

let inputPanel;

const MAX_HEIGHT = 200;
class QuickDollarInputPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      onHide: undefined,
      onChange: undefined,
      height: 0
    };
    inputPanel = this;
    this.throttledOnChange = throttle(50, () => {
      this.state.onChange(this._latestValue);
    });
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
    this.hide = this.hide.bind(this);
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dy !== 0,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.setState({
          height: Math.max(0, Math.min(MAX_HEIGHT, MAX_HEIGHT + (-1) * gestureState.dy))
        });
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if(gestureState.dy > 20) {
          this.hide();
        } else {
          this.setState({ height: MAX_HEIGHT });
        }
      }
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
      onChange: onChange,
      onHide: onHide,
      height: MAX_HEIGHT
    });
  }
  render() {
    let {value, maximumValue, height} = this.state;
    return (
      <View style={[styles.inputPanel, {height: height}]}
        {...this._panResponder.panHandlers}
        >
        <Dial style={{flex: 1, marginVertical: 10, width: 140, height: 140, alignSelf: 'center'}}
          value={numericTranslator.toDial(value)}
          minimumValue={numericTranslator.toDial(0)}
          maximumValue={numericTranslator.toDial(maximumValue)}
          onValueChange={(num) => {
            this._latestValue = numericTranslator.fromDial(num);
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
    this.setState({height: 0, onHide: null});
  }
  onSelect(num) {
    this.setState({value: num});
    this.state.onChange(num);
  }
}
QuickDollarInputPanel.propTypes = {
  onVisibilityChange: PropTypes.func
}

const numericTranslator = {
  fromDial: num => Math.round((num || 0) / 360 * 50) * 1000,
  toDial: num =>  ((num / 1000) / 50) * 360 || 0
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
  inputPanel: {
    alignItems: 'stretch',
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
