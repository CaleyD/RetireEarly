'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { PropTypes } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SideBarContainer } from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';

const calc = require('./calculator.js');
import formatMoney from './formatMoney';
import Progress from './progressView.js';
import CollapsableBottomDrawer from './collapsableBottomDrawer';
import {reset} from './reducers/index.js';

export default class OutlookTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { sideBarVisible: false };
  }
  render() {
    const { scenario, dispatch } = this.props;
    const outlook = calc.calculate(scenario);

    return (
      <View style={{flexDirection: 'column', alignItems: 'stretch', flex: 1}}>
        <View style={styles.pageHeader}>
          <View style={{
              height: 50, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center',
              backgroundColor: 'green'
            }}>

            {typeof outlook.yearsToRetirement !== 'number' ?
              <Text style={styles.instructions}>Your path to financial independence</Text>
              :
              <View style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white'}}>{Math.round(10*outlook.yearsToRetirement)/10} years</Text>
                <Text style={{color: 'white'}}>{formatMoney(outlook.retirementPortfolio)}</Text>
              </View>
            }
            <TouchableOpacity onPress={() => dispatch(reset())}>
              <Text style={styles.pageHeaderButton}>RESET</Text>
            </TouchableOpacity>
          </View>

        </View>

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
