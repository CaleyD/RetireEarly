'use strict';
import React, { Component } from 'react';
import { AppRegistry, AsyncStorage, View, Text } from 'react-native';
import OutlookPage from './lib/components/outlookPage';
import Intro from './lib/components/intro';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './lib/reducers/index.js';
import { setInitialPortfolio, editPeriod } from './lib/reducers/scenario.js'
const key = 'scenario';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { scenario: null };

    // init store
    AsyncStorage.getItem(key, (err, value) => {
      if(err) {
        throw err;
      }
      this.store = value ?
        createStore(reducer,  Object.freeze(JSON.parse(value))) :
        createStore(reducer);
      const loadStateFromStore = () => {
        this.setState({ scenario: this.store.getState().scenario });
      };
      this.unsubscribeStoreListener = this.store.subscribe(() => {
        AsyncStorage.setItem(key, JSON.stringify(this.store.getState()));
        requestAnimationFrame(loadStateFromStore);
      });
      loadStateFromStore();
    });
  }
  componentWillUnmount() {
    this.unsubscribeStoreListener();
  }
  render() {
    if(!this.store) {
      return <View><Text>Loading</Text></View>;
    } else {
      const {scenario} = this.store.getState();
      return (
        <Provider store={this.store}>
          {(typeof scenario.initialPortfolio !== 'number') ?
            <Intro onContinue={values=>this.continueFromIntro(values)}/> :
            <OutlookPage/>
          }
        </Provider>
      );
    }
  }
  continueFromIntro({ initialPortfolio, income, expenses }) {
    this.store.dispatch(setInitialPortfolio(initialPortfolio));
    this.store.dispatch(editPeriod(this.state.scenario.incomePeriods[0], { income, expenses }));
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
