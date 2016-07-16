'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SideBarContainer } from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';
import Header from './header.js';
import Progress from './progressView.js';
const calc = require('./calculator.js');

export default class OutlookPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { sideBarVisible: false };
  }
  render() {
    const { scenario, dispatch } = this.props;
    const outlook = calc.calculate(scenario);

    return (
      <View style={{flexDirection: 'column', alignItems: 'stretch', flex: 1}}>

        <Header outlook={outlook} dispatch={dispatch} />

        <SideBarContainer style={{alignItems: 'stretch', flex: 1}}
          onVisibilityChange={sideBarVisible=>this.setState({ sideBarVisible })}>
          <View style={[styles.container, {backgroundColor: 'white', flex: 1}]}>

            <Progress scenario={scenario} outlook={outlook} dispatch={dispatch}
              hideDeleteAndReorder={this.state.sideBarVisible}/>

            <View style={{position: 'absolute', bottom: 0}}>
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
