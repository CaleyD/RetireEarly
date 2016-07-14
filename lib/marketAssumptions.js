'use strict';
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
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import {setWithdrawalRate, setAnnualReturn} from './reducers/index.js';

const CARD_PREVIEW_WIDTH = 20
const CARD_MARGIN = 5;

const presets = [
  {title: 'conservative', withdrawalRate: .035, returnRate: .05},
  {title: 'moderate', withdrawalRate: .04, returnRate: .05},
  {title: 'aggressive', withdrawalRate: .05, returnRate: .05}
];

class MarketAssumptions extends PureComponent {
  render() {
    const {dispatch} = this.props;
    const itemWidth = Dimensions.get('window').width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;
    return (
      <ScrollView
        style={styles.container}
        onLayout={e => this.setState({width: e.nativeEvent.layout.width})}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate={0}
        snapToInterval={itemWidth + CARD_MARGIN*2}
        snapToAlignment='start'
        contentContainerStyle={styles.content}
      >
        {presets.map((item => (
          <TouchableOpacity key={item.title}
            onPress={()=>{
              dispatch(setWithdrawalRate(item.withdrawalRate));
              dispatch(setAnnualReturn(item.returnRate));
            }}
            >
            <View style={[styles.card, {width: itemWidth}]}>
              <Text>{item.title}</Text>
              <Text>Info</Text>
            </View>
          </TouchableOpacity>
        )))}

        <View style={[styles.card, {width: itemWidth}]}>
          <Text>Card 4</Text>
        </View>
      </ScrollView>
    );
  }
}
MarketAssumptions.propTypes = {
  scenario: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
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
    marginHorizontal: CARD_MARGIN,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MarketAssumptions;
