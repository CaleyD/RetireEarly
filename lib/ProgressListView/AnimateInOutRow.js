'use strict';
import React, { PropTypes, Component } from 'react';
import { Animated } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class AnimateInOutRow extends Component {
  constructor(props) {
    super(props);
    this.state = {style: { height: new Animated.Value(0), overflow: 'hidden' }};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  animateIn(callback) {
    Animated.timing(
      this.state.style.height, { toValue: 45, duration: 150 }
    ).start(callback);
  }
  animateOut(callback) {
    Animated.timing(
      this.state.style.height, { toValue: 0, duration: 150 }
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
