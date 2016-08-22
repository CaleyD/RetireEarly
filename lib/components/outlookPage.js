'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { Component, PropTypes } from 'react';
import { View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { SideBarContainer } from './quick-dollar-input-sidebar';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import styles from '../styles.js';
import MarketAssumptions from './marketAssumptions';
import Header from './header.js';
import Progress from './ProgressListView/index.js';
import Menu from './Menu.js';
const SideMenu = require('react-native-side-menu');
const calc = require('../calculator.js');

class OutlookPage extends Component {
  constructor(props) {
    super(props);
    this.state = { sideBarVisible: false };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
    this.onSidebarVisibilityChange = this.onSidebarVisibilityChange.bind(this);
  }
  onSidebarVisibilityChange (sideBarVisible) {
    this.setState({ sideBarVisible });
  }
  render() {
    const { scenario, dispatch, viewExpanded, editingMarketAssumptions } = this.props;
    const outlook = calc.calculate(scenario);

    return (
      <SideMenu
        ref={c=>this.menu = c}
        openMenuOffset={Dimensions.get('window').width * .85}
        menu={<Menu dispatch={dispatch}/>}>
        <View style={styles.outlookPage}>

          <Header outlook={outlook} menuPressed={()=>this.menu.openMenu(true)}/>

          <SideBarContainer style={styles.sidebarContainer}
            onVisibilityChange={this.onSidebarVisibilityChange}>
            <View style={styles.sidebarContentContainer}>

              <Progress scenario={scenario} outlook={outlook}
                hideDeleteAndReorder={this.state.sideBarVisible}
                viewExpanded={viewExpanded}/>

              {editingMarketAssumptions ?
                <MarketAssumptions dispatch={dispatch}
                  withdrawalRate={scenario.withdrawalRate}
                  annualReturn={scenario.annualReturn} /> : null
              }
            </View>
          </SideBarContainer>

        </View>
      </SideMenu>
    );
  }
}

OutlookPage.propTypes = {
  scenario: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  editingMarketAssumptions: PropTypes.bool.isRequired,
  viewExpanded: PropTypes.bool.isRequired
};

export default connect(
  state => ({
    scenario: state.scenario,
    editingMarketAssumptions: state.viewDetails.editingMarketAssumptions,
    viewExpanded: state.viewDetails.expanded
  })
)(OutlookPage);
