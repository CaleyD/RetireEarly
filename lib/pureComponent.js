import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Component } from 'react';

export default class PureComponent extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
}
