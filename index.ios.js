'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  NavigatorIOS
} from 'react-native';
import OutlookPage from './lib/outlookPage';
import Intro from './lib/intro';
import styles from './lib/styles.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intro: true
    };
  }
  render() {
    if(this.state.intro) {
      return <Intro onContinue={()=>this.setState({intro: false})}/>;
    } else {
      return <OutlookPage/>;
    }
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
