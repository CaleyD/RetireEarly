'use strict';
import { Animated } from 'react-native';

const AnimateInOutMixin = (superclass) => class extends superclass {
  constructor(props) {
    super(props);
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
      this.animate(0);
    } else {
      this.animate(45);
    }
  }
};

export default AnimateInOutMixin;
