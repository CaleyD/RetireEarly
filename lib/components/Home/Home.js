'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MarketAssumptions from './MarketAssumptions';
import Progress from './ProgressListView/index.js';

class OutlookPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render() {
    const { editingMarketAssumptions } = this.props;

    return (
      <View style={styles.sidebarContentContainer}>
        <Progress />
        { editingMarketAssumptions ? <MarketAssumptions /> : null }
      </View>
    );
  }
}
OutlookPage.propTypes = {
  editingMarketAssumptions: PropTypes.bool.isRequired
};

var styles = StyleSheet.create({
  sidebarContentContainer: {
    marginTop: 63,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white'
  }
});

export default connect(
  ({ui}) => ({ editingMarketAssumptions: ui.editingMarketAssumptions })
)(OutlookPage);
