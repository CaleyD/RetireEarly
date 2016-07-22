'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { PropTypes, Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SideBarContainer } from './quick-dollar-input-sidebar';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';
import Header from './header.js';
import Progress from './ProgressListView/index.js';
const calc = require('./calculator.js');

export default class OutlookPage extends Component {
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
    const { scenario, dispatch } = this.props;
    const outlook = calc.calculate(scenario);

    return (
      <View style={styles.outlookPage}>

        <Header outlook={outlook} dispatch={dispatch} />

        <SideBarContainer style={styles.sidebarContainer}
          onVisibilityChange={this.onSidebarVisibilityChange}>
          <View style={styles.sidebarContentContainer}>

            <Progress scenario={scenario} outlook={outlook} dispatch={dispatch}
              hideDeleteAndReorder={this.state.sideBarVisible}/>

            <View style={styles.marketAssumptionsContainer}>
              <MarketAssumptions dispatch={dispatch}
                withdrawalRate={scenario.withdrawalRate}
                annualReturn={scenario.annualReturn} />
            </View>
          </View>
        </SideBarContainer>

      </View>
    );
  }
}
