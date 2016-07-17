'use strict';
import React, { PropTypes, Component } from 'react';
import { Animated } from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class AnimateInOutRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { height: new Animated.Value(0), overflow: 'hidden' }
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  animate(height, callback) {
    Animated.timing(
      this.state.style.height, { toValue: height, duration: 150 }
    ).start(callback);
  }
  animateOut(callback) {
    this.animate(0, callback);
  }
  componentDidMount() {
    this.animate(45);
  }
  componentDidUpdate() {
    if(this.props.deleted) {
      this.animate(0);
    } else {
      this.animate(45);
    }
  }
}
