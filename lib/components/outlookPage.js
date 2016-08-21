'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
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
    const { scenario, dispatch, viewDetails } = this.props;
    const outlook = calc.calculate(scenario);

    return (
      <SideMenu ref={c=>this.menu = c} menu={<Menu dispatch={dispatch}/>}>
        <View style={styles.outlookPage}>

          <Header
            outlook={outlook} viewExpanded={viewDetails.expanded}
            menuPressed={()=>this.menu.openMenu(true)}/>

          <SideBarContainer style={styles.sidebarContainer}
            onVisibilityChange={this.onSidebarVisibilityChange}>
            <View style={styles.sidebarContentContainer}>

              <Progress scenario={scenario} outlook={outlook} dispatch={dispatch}
                hideDeleteAndReorder={this.state.sideBarVisible}
                viewExpanded={viewDetails.expanded}/>

              <View style={styles.marketAssumptionsContainer}>
                <MarketAssumptions dispatch={dispatch}
                  withdrawalRate={scenario.withdrawalRate}
                  annualReturn={scenario.annualReturn} />
              </View>
            </View>
          </SideBarContainer>

        </View>
      </SideMenu>
    );
  }
}

OutlookPage.propTypes = {
  scenario: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(
  state => { return { scenario: state.scenario, viewDetails: state.viewDetails } }
)(OutlookPage);
