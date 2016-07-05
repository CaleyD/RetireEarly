/*
* TODO:
* - highlight selected item
* - auto select scrolled item
* - expand/collapse from right side
* - custom values
* - more info button and screens
*/
import React, { PropTypes } from 'react';
import PureComponent from './pureComponent';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
let store = require('./scenarioStore');

const CARD_PREVIEW_WIDTH = 20
const CARD_MARGIN = 5;
const CARD_WIDTH = Dimensions.get('window').width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;

const presets = [
  {title: 'conservative', withdrawalRate: .035, returnRate: .05},
  {title: 'moderate', withdrawalRate: .04, returnRate: .05},
  {title: 'aggressive', withdrawalRate: .05, returnRate: .05}
];

class MarketAssumptions extends PureComponent {
  render() {
    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate={0}
        snapToInterval={CARD_WIDTH + CARD_MARGIN*2}
        snapToAlignment='start'
        contentContainerStyle={styles.content}
      >
        {presets.map((item => (
          <TouchableHighlight key={item.title}
            onPress={()=>{
              store.setWithdrawalRate(item.withdrawalRate);
              store.setAnnualReturn(item.returnRate);
            }}
            >
            <View style={styles.card}>
              <Text>{item.title}</Text>
              <Text>Info</Text>
            </View>
          </TouchableHighlight>
        )))}

        <View style={styles.card}>
          <Text>Card 4</Text>
        </View>
      </ScrollView>
    );
  }
}
MarketAssumptions.propTypes = {
  scenario: PropTypes.object.isRequired
};

let styles = StyleSheet.create({
  container: {
    height: 44,
    backgroundColor: '#F5FCFF',
  },
  content: {
    paddingHorizontal: CARD_PREVIEW_WIDTH,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ccc',
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MarketAssumptions;
