'use strict';

import React, { Component, PropTypes } from 'react';
import ReactNative, {
  TextInput
} from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default class NumberInput extends Component {
  constructor(props) {
    super(props);
    shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {value: props.value || 0};
  }
  render() {
    var val = this.state.focused || !this.props.getFormattedText?
      this.state.value.toString() :
      this.props.getFormattedText(this.state.value);
    return (
      <TextInput style={this.props.inputStyle}
          maxLength={9} autoCorrect={false} keyboardType='number-pad'
          value={val}
          onChangeText={this.onChange.bind(this)}
          onBlur={() => this.setState({focused: false})}
          ref={(c) => this._input = c }
          onFocus={this.inputFocused.bind(this)}
          />
    );
  }
  onChange(text) {
    var num = parseInt(text) || 0;
    this.setState({value: num});
    this.props.onChange(num);
  }
  inputFocused() {
    this.setState({focused: true})
    if(this.props.scrollview) {
      setTimeout(() => {
        let scrollResponder = this.props.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          ReactNative.findNodeHandle(this._input),
          110, //additionalOffset
          true
        );
      }, 50);
    }
  }
}
NumberInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  scrollview: PropTypes.object,
  getFormattedText: PropTypes.func,
  inputStyle: React.PropTypes.any
}
