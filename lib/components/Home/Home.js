'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MarketAssumptions from './MarketAssumptions';
import Progress from './ProgressListView/index.js';

class OutlookPage extends Component {
  constructor (props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render () {
    const { editingMarketAssumptions } = this.props;

    return (
      <View style={styles.container}>
        <Progress />
        { editingMarketAssumptions ? <MarketAssumptions /> : null }
      </View>
    );
  }
}
OutlookPage.propTypes = {
  editingMarketAssumptions: PropTypes.bool.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default connect(
  ({ui}) => ({ editingMarketAssumptions: ui.editingMarketAssumptions })
)(OutlookPage);
