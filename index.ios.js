'use strict';
import React, { Component } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import OutlookPage from './lib/components/outlookPage';
import Intro from './lib/components/intro';
import { Provider, connect } from 'react-redux';
import { setInitialPortfolio, editPeriod } from './lib/reducers/scenario.js'
import store from './store.js';

const Routes = ({ introCompleted, storageLoaded }) => (
  <Provider store={store}>
    {!storageLoaded ?
      <View><Text>Loading</Text></View>
      :
      {!introCompleted ?
        <Intro onContinue={continueFromIntro}/> :
        <OutlookPage/>
      }
    }
  </Provider>
);

function continueFromIntro({ initialPortfolio, income, expenses }) {
  store.dispatch(setInitialPortfolio(initialPortfolio));
  store.dispatch(editPeriod(
    store.getState().scenario.incomePeriods[0],
    { income, expenses }
  ));
}

const ConnectedRoutes = connect(
  ({scenario, storage}) => ({
    introCompleted: scenario.initialPortfolio === 'number',
    storageLoaded: storage.storageLoaded
  })
)(Routes);

const App = () => (
  <Provider store={store}>
    <ConnectedRoutes />
  </Provider>
);

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
