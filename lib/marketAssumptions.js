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
  constructor(props) {
    super(props);
    this.state = {};
  }
  getItemWidth() {
    return this.state.width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;
  }
  render() {
    const itemWidth = this.getItemWidth();
    return (
      <ScrollView
        style={styles.container}
        ref={c => (this.scrollView = c)}
        onScroll={({ nativeEvent: { contentOffset } })=>{
          const visibleIndex = Math.floor((contentOffset.x + .5 * this.state.width) / this.state.width);
          if(this.state.visibleIndex != visibleIndex) {
            this.selectItem(presets[visibleIndex]);
            this.setState({visibleIndex});
          }
        }}
        scrollEventThrottle={50}
        onLayout={(e) => {
          this.setState({ width: e.nativeEvent.layout.width });
          setTimeout(()=>{
            const { visibleIndex } = this.state;
            this.scrollView.scrollTo({ x: visibleIndex * (this.getItemWidth() + CARD_MARGIN*2) });
          }, 50);
        }}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate={0}
        snapToInterval={itemWidth + CARD_MARGIN*2}
        snapToAlignment='start'
        contentContainerStyle={styles.content}
      >
        {presets.map((item => (
          <View key={item.title} style={[styles.card, {width: itemWidth}]}>
            <Text>{item.title}</Text>
            <Text>Info</Text>
          </View>
        )))}
      </ScrollView>
    );
  }
  selectItem(item) {
    const {dispatch} = this.props;
    dispatch(setWithdrawalRate(item.withdrawalRate));
    dispatch(setAnnualReturn(item.returnRate));
  }
}
MarketAssumptions.propTypes = {
  scenario: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    backgroundColor: 'transparent',
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
