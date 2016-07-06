'use strict';

import React, {PropTypes, Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';

export default class CollapsableBottomDrawer extends Component{
  constructor(props) {
    super(props);

    let collapsedHeight = props.collapsedHeight;
    let windowHeight = Dimensions.get('window').height;

    this._collapsedPos = windowHeight - collapsedHeight;
    this._expandedPos = 0;
    this._pos = new Animated.Value(windowHeight - collapsedHeight);
    this._expanded = false;
    this._dragDistanceTrigger = 50;
  }
  componentWillMount() {
    this._lastPos = this._collapsedPos;
    this._pos.addListener((value) => { this._lastPos = value.value; })

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderMove: Animated.event([
        null, {dy: this._pos},
        ]),
      onPanResponderGrant: (e, gestureState) => {
        this._pos.setOffset(this._lastPos);
        this._pos.setValue(0);
      },
      onPanResponderRelease: (e, gestureState) => {
        this._pos.flattenOffset();
        if ((gestureState.dy < this._dragDistanceTrigger * -1) && !this._expanded) {
          this._expand();
        } else if ((gestureState.dy > this._dragDistanceTrigger * -1) && this._expanded) {
          this._collapse();
        } else {
          (this._expanded) ? this._expand() : this._collapse()
        }
      }
    });
  }
  _expand() {
    Animated.spring(this._pos, {
      toValue: this._expandedPos,
      friction: 8
    }).start();
    this._expanded = true;
  }
  _collapse() {
    Animated.spring(this._pos, {
      toValue: this._collapsedPos,
      friction: 8
    }).start();
    this._expanded = false;
  }

  render() {
    let interpolatedPos = this._pos.interpolate({
      inputRange: [0, this._collapsedPos],
      outputRange: [0, this._collapsedPos],
      extrapolate: 'clamp'
    });

    let interpolatedExpandedOpacity = this._pos.interpolate({
      inputRange: [0, this._collapsedPos],
      outputRange: [1, 0]
    });

    let interpolatedCollapsedOpacity = this._pos.interpolate({
      inputRange: [0, this._collapsedPos],
      outputRange: [0, 1]
    });

    return (
      <Animated.View
          style={[{ backgroundColor: 'red', height: Dimensions.get('window').height, left: 0, right: 0, position: 'absolute', top: interpolatedPos }]}
          {...this._panResponder.panHandlers}
        >
        <Animated.View style={{ position: 'absolute', top: 0, opacity: interpolatedExpandedOpacity }}>
      		{this.props.renderExpanded()}
       	</Animated.View>
        <Animated.View style={{ position: 'absolute', top: 0, opacity: interpolatedCollapsedOpacity }}>
          	{this.props.renderCollapsed()}
      	</Animated.View>
      </Animated.View>
    );
  }
}
CollapsableBottomDrawer.propTypes = {
  collapsedHeight: PropTypes.number.isRequired,
  renderCollapsed: PropTypes.func.isRequired,
  renderExpanded: PropTypes.func.isRequired
}
