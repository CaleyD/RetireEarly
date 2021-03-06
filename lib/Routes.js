'use strict';
import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import Home from './components/Home/Home.js';
import Intro from './components/Intro/Intro.js';

const Routes = ({ introCompleted, loading, firstIncomePeriod, setInitialPortfolio, editPeriod }) => {
  if(loading) {
    return <View><Text>Loading</Text></View>;
  }
  if(!introCompleted) {
    return <Intro/>;
  }
  return <Home/>;
};

export default connect(
  ({ scenario, storage }) => ({
    introCompleted: typeof scenario.initialPortfolio === 'number',
    loading: !storage.storageLoaded
  })
)(Routes);


/*
class Outlook extends PureComponent {
  render() {
    var yearsToRetirement = Math.round(10 * this.props.retirementOutlook.yearsToRetirement) / 10;
    return (
      <TouchableHighlight underlayColor='#99d9f4'
        onPress={()=>this.navigateToDetails()}
        style={{
          backgroundColor: 'white',
          padding: 7,
          alignSelf: 'stretch'
        }}>
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
