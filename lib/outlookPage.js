// TODO: drag/drop income periods
// TODO: minimized/expanded View
// TODO: edit mode (with sort and delete icons)
// TODO: swipe to delete
// TODO: drop shadow on header when listview is not at the top
// TODO: add cancel button to new income insertion control
// TODO: fix layout bug after resetting view
import React, { PropTypes } from 'react';
import {
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import {QuickDollarInputSidebar} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';

var scenarioStore = require('./scenarioStore');
var calc = require('./calculator.js');
import formatMoneyCompact from './formatMoney';
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
    var scenario = this.state.scenario;

    if(scenario == null) {
      // scenario not yet loaded
      return <View />
    }

    var retirementOutlook = calc.calculate(scenario);

    return (
      <View style={styles.outlookPage}>

        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.welcome}>Early Retirement Calculator!</Text>
            <Text style={styles.instructions}>Your path to financial independence</Text>
          </View>

          <TouchableHighlight onPress={()=>scenarioStore.resetScenario()}>
            <Text style={styles.pageHeaderButton}>RESET</Text>
          </TouchableHighlight>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
          <View style={[styles.container, {backgroundColor: 'white', flex: .8}]}>

            <Progress scenario={scenario} retirementOutlook={retirementOutlook}
              hideDeleteAndReorder={this.state.sideBarVisible}/>

            <View style={{
                height: 50, backgroundColor: 'pink', flexDirection: 'row',
                alignItems: 'stretch', justifyContent: 'center'
              }}>

              <View style={{flex: 3, backgroundColor: 'green', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white'}}>{Math.round(10*retirementOutlook.yearsToRetirement)/10} years</Text>
                <Text style={{color: 'white'}}>{formatMoneyCompact(retirementOutlook.retirementPortfolioValue)}</Text>
              </View>

            </View>
          </View>

          <QuickDollarInputSidebar
            onVisibilityChange={(visible)=>this.setState({sideBarVisible: visible})} />
        </View>

        <View>
          <MarketAssumptions scenario={scenario}/>
        </View>
      </View>
    );
  }
}
