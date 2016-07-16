'use strict';
import React, { PropTypes } from 'react';
import { Animated } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PureComponent from '../pureComponent';

export default class AnimateInOutRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {style: { height: new Animated.Value(0), overflow: 'hidden' }};
  }
  animateIn(callback) {
    Animated.timing(
      this.state.style.height,
      { toValue: 45, duration: 150 }
    ).start(callback);
  }
  animateOut(callback) {
    Animated.timing(
      this.state.style.height,
      { toValue: 0, duration: 150 }
    ).start(callback);
  }
  componentDidMount() {
    this.animateIn();
  }
  componentDidUpdate() {
    if(this.props.deleted) {
      this.animateOut();
    } else {
      this.animateIn();
    }
  }
}
