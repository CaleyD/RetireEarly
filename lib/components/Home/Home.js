'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { Component, PropTypes } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import MarketAssumptions from './MarketAssumptions';
import Header from './Header.js';
import Progress from './ProgressListView/index.js';
import Menu from '../Menu.js';
const SideMenu = require('react-native-side-menu');

class OutlookPage extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
  }
  render() {
    const { editingMarketAssumptions } = this.props;

    return (
      <SideMenu menu={<Menu/>} ref={c=>this.menu = c}
        openMenuOffset={Dimensions.get('window').width * .85}
        >
        <View style={styles.outlookPage}>

          <Header menuPressed={()=>this.menu.openMenu(true)}/>

          <View style={styles.sidebarContentContainer}>
            <Progress />
            { editingMarketAssumptions ? <MarketAssumptions /> : null }
          </View>

        </View>
      </SideMenu>
    );
  }
}
OutlookPage.propTypes = {
  editingMarketAssumptions: PropTypes.bool.isRequired
};

var styles = StyleSheet.create({
  outlookPage: {
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1
  },
  sidebarContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white'
  }
});

export default connect(
  ({ui}) => ({ editingMarketAssumptions: ui.editingMarketAssumptions })
)(OutlookPage);
