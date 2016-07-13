'use strict';
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import OutlookPage from './lib/outlookPage';
import Intro from './lib/intro';

import { createStore } from 'redux';
import reducer, { setInitialPortfolio, editPeriod } from './lib/reducers/index.js';
const store = createStore(reducer);
const dispatch = store.dispatch.bind(store);
/*
const key = 'scenario';
AsyncStorage.getItem(key, function(err, value) {
  if(err) {
    return callback(err);
  }
  scenario = value ? JSON.parse(value) : null;
  store = createStore(reducer, Object.freeze(scenario));
});
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intro: true,
      scenario: store.getState().scenario
    };
    this.unsubscribeScenarioListener = store.subscribe(() => {
      requestAnimationFrame(()=> {
        this.setState({ scenario: store.getState().scenario });
      });
    });
  }
  componentWillUnmount() {
    this.unsubscribeScenarioListener();
  }
  render() {
    if(this.state.intro) {
      return <Intro onContinue={(values)=>this.continueFromIntro(values)}/>;
    } else {
      return <OutlookPage scenario={this.state.scenario} dispatch={dispatch}/>;
    }
  }
  continueFromIntro({ initialPortfolio, income, expenses }) {
    dispatch(setInitialPortfolio(initialPortfolio));
    dispatch(editPeriod(this.state.scenario.incomePeriods[0],
      { income: income, expenses: expenses }));
    this.setState({ intro: false });
  }
}

AppRegistry.registerComponent('EarlyRetireCalc', () => App);

/*
class Outlook extends PureComponent {
  render() {
    var yearsToRetirement = Math.round(10 * this.props.retirementOutlook.yearsToRetirement) / 10;
    return (
      <TouchableHighlight underlayColor='#99d9f4'
        onPress={()=>this.navigateToDetails()}
        style={styles.outlook}>
        <View>
          {
            yearsToRetirement === NaN ?
              <Text>
                You will need {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolio)} to
                retire but you will never get there because you are outspending your income.
              </Text>
            : yearsToRetirement <= 0 ?
              <Text>
                You need {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolio)} and
                you already have it - you can retire now!
              </Text>
            :
              <Text>
                You can retire in {yearsToRetirement} {yearsToRetirement === 1 ? 'year ' : 'years '}
                with {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolio)}
              </Text>
          }
          <Text style={styles.buttonText}>Go</Text>
        </View>
      </TouchableHighlight>
    );
  }
  navigateToDetails() {
    this.props.navigator.push({
        title: "Path to Financial Independence",
        component: OutlookTablePage,
        backButtonTitle: 'back',
        passProps: {
          toggleNavBar: this.props.toggleNavBar,
          scenario: this.props.scenario
        }
      });
  }
}
*/
