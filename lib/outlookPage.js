// TODO: drag/drop income periods
// TODO: minimized/expanded View
// TODO: edit mode (with sort and delete icons)
// TODO: swipe to delete
// TODO: drop shadow on header when listview is not at the top
// TODO: add cancel button to new income insertion control
// TODO: fix layout bug after resetting view
import React, { PropTypes, Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import {QuickDollarInputSidebar} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';

let scenarioStore = require('./scenarioStore');
let calc = require('./calculator.js');
import formatMoney from './formatMoney';
import Progress from './progressView.js';

export default class OutlookTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scenario: null,
      sideBarVisible: false
    }
    scenarioStore.getScenario((err, scenario) => this.setState({scenario}));
    this.scenarioListener = scenarioStore.addListener('change',
      (scenario) => { this.setState({scenario})}
    );
  }
  componentWillUnmount() {
    this.scenarioListener.remove();
  }
  render() {
    let scenario = this.state.scenario;
    if(scenario == null) { // scenario not yet loaded
      return <View />
    }
    let outlook = calc.calculate(scenario);

    return (
      <View style={styles.outlookPage}>

        <View style={styles.pageHeader}>
          <Text style={styles.instructions}>Your path to financial independence</Text>

          <TouchableHighlight onPress={()=>scenarioStore.resetScenario()}>
            <Text style={styles.pageHeaderButton}>RESET</Text>
          </TouchableHighlight>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
          <View style={[styles.container, {backgroundColor: 'white', flex: .8}]}>

            <Progress scenario={scenario} outlook={outlook}
              hideDeleteAndReorder={this.state.sideBarVisible}/>

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

          <QuickDollarInputSidebar
            onVisibilityChange={(visible)=>this.setState({sideBarVisible: visible})} />
        </View>
      </View>
    );
  }
}
