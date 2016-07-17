'use strict';
import React, { Component} from 'react';
import { Animated } from 'react-native';

const AnimateInOutMixin = (superclass) => class extends superclass {
  constructor(props) {
    super(props);
    this.didFireDeleted = false;
    this.state = {
      style: { height: new Animated.Value(0), overflow: 'hidden' }
    };
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
    if(super.componentDidMount) {
      super.componentDidMount();
    }
    this.animateToProp()
  }
  componentDidUpdate() {
    if(super.componentDidUpdate) {
      super.componentDidUpdate();
    }
    this.animateToProp()
  }
  animateToProp() {
    if(this.props.deleted) {
      this.animate(0, this.props.onDeleteAnimationComplete);
    } else {
      this.animate(45);
    }
  }
};

class AnimateInOut extends AnimateInOutMixin(Component) {
  render() {
    return (
      <Animated.View style={this.state.style}>
        {this.props.children}
      </Animated.View>
    );
  }
}

export {AnimateInOut, AnimateInOutMixin};
