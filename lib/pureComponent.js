import PureRenderMixin from 'react-addons-pure-render-mixin';
import React, { Component, PropTypes } from 'react';

export default class PureComponent extends Component {
  constructor(props) {
    super(props);
    shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
}
