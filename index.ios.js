'use strict';
import React, { Component } from 'react';
import { AppRegistry, AsyncStorage, View, Text } from 'react-native';
import OutlookPage from './lib/outlookPage';
import Intro from './lib/intro';

import { createStore } from 'redux';
import reducer, { setInitialPortfolio, editPeriod } from './lib/reducers/index.js';
const key = 'scenario';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      scenario: null
    };

    // init store
    AsyncStorage.getItem(key, (err, value) => {
      if(err) {
        throw err;
      }
      const store = value ?
        createStore(reducer,  Object.freeze(JSON.parse(value))) :
        createStore(reducer);
      this.dispatch = store.dispatch.bind(store);
      this.unsubscribeStoreListener = store.subscribe(() => {
        AsyncStorage.setItem(key, JSON.stringify(store.getState()));
        requestAnimationFrame(()=> {
          this.setState({ scenario: store.getState().scenario });
        });
      });
      this.setState({ loading: false, scenario: store.getState().scenario });
    });
  }
  componentWillUnmount() {
    if(this.unsubscribeStoreListener) {
      this.unsubscribeStoreListener();
    }
  }
  render() {
    if(this.state.loading) {
      return <View><Text>Loading</Text></View>;
    } else if(!this.state.scenario || typeof this.state.scenario.initialPortfolio !== 'number') {
      // todo: refactor conditional statement
      return <Intro onContinue={(values)=>this.continueFromIntro(values)}/>;
    } else {
      return <OutlookPage scenario={this.state.scenario} dispatch={this.dispatch}/>;
    }
  }
  continueFromIntro({ initialPortfolio, income, expenses }) {
    this.dispatch(setInitialPortfolio(initialPortfolio));
    this.dispatch(editPeriod(this.state.scenario.incomePeriods[0], { income, expenses }));
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
}
*/
