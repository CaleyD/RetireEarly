'use strict';
// TODO: minimized/expanded View
// TODO: swipe to delete
// TODO: drop shadow on header when listview is not at the top
// TODO: fix layout bug after resetting view
import React, { PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {QuickDollarInputSidebar} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';

let calc = require('./calculator.js');
import formatMoney from './formatMoney';
import Progress from './progressView.js';
import CollapsableBottomDrawer from './collapsableBottomDrawer';

//import { AsyncStorage } from 'react-native';
import { createStore } from 'redux';
import reducer, {reset} from './reducers/index.js';
const store = createStore(reducer);
const dispatch = store.dispatch.bind(store);
//const key = 'scenario';
//let store;
/*
AsyncStorage.getItem(key, function(err, value) {
  if(err) {
    return callback(err);
  }
  scenario = value ? JSON.parse(value) : null;
  store = createStore(reducer, Object.freeze(scenario));
});*/

export default class OutlookTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scenario: store.getState().scenario,
      sideBarVisible: false
    }

    this.unsubscribeScenarioListener = store.subscribe(() => {
      requestAnimationFrame(()=> {
        this.setState({scenario: store.getState().scenario});
      });
    });
  }
  componentWillUnmount() {
    this.unsubscribeScenarioListener();
  }
  render() {
    let {scenario} = this.state;
    if(!scenario) { // scenario not yet loaded
      return <View><Text>Loading</Text></View>;
    }

    let outlook = calc.calculate(scenario);

    return (
      <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
        <View style={[styles.container, {backgroundColor: 'white', flex: .8}]}>

          <View style={styles.pageHeader}>
            <Text style={styles.instructions}>Your path to financial independence</Text>
            <TouchableOpacity onPress={() => dispatch(reset())}>
              <Text style={styles.pageHeaderButton}>RESET</Text>
            </TouchableOpacity>
          </View>

          <Progress scenario={scenario} outlook={outlook} dispatch={dispatch}
            hideDeleteAndReorder={this.state.sideBarVisible}/>

          <CollapsableBottomDrawer collapsedHeight={60}
            renderExpanded={()=>null}
            renderCollapsed={()=>
              <View>
                <View style={{
                    height: 50, flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center'
                  }}>

                  <View style={{flex: 3, backgroundColor: 'green', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white'}}>{Math.round(10*outlook.yearsToRetirement)/10} years</Text>
                    <Text style={{color: 'white'}}>{formatMoney(outlook.retirementPortfolio)}</Text>
                  </View>

                </View>

                <View>
                  <MarketAssumptions scenario={scenario} />
                </View>
              </View>
            }
          />
        </View>

        <QuickDollarInputSidebar
          onVisibilityChange={(visible)=>this.setState({sideBarVisible: visible})} />
      </View>
    );
  }
}
