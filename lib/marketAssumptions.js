'use strict';
/*
* TODO:
* - expand/collapse from right side
* - custom values
* - more info button and screens
*/
import React, { PropTypes, Component } from 'react';
import {
  Text, TouchableOpacity, View, StyleSheet, Dimensions, ScrollView
} from 'react-native';
import { setWithdrawalRate, setAnnualReturn } from './reducers/index.js';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const CARD_PREVIEW_WIDTH = 20
const CARD_MARGIN = 5;

const presets = [
  {title: 'conservative', withdrawalRate: .035, returnRate: .05},
  {title: 'moderate', withdrawalRate: .04, returnRate: .05},
  {title: 'aggressive', withdrawalRate: .05, returnRate: .05}
];

class MarketAssumptions extends Component {
  constructor(props) {
    super(props);

    let { withdrawalRate, returnRate } = this.props;
    let visibleIndex = presets.findIndex(i =>
      i.withdrawalRate === withdrawalRate && i.returnRate === returnRate);
    if(visibleIndex < 0) visibleIndex = 1;
    this.state = { visibleIndex };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    this.scrollToSelectedItem(false);
  }
  scrollToSelectedItem(animated = true) {
    this.scrollView.scrollTo({
      x: this.state.visibleIndex * (this.getItemWidth() + CARD_MARGIN*2),
      animated
    });
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
          requestAnimationFrame(() => this.scrollToSelectedItem(false));
        }}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate={0}
        snapToInterval={itemWidth + CARD_MARGIN*2}
        snapToAlignment='start'
        contentContainerStyle={styles.content}
      >
        {presets.map(({title, withdrawalRate, returnRate}, index) => (
          <View key={index} style={[styles.card, {width: itemWidth}, index===this.state.visibleIndex ? {backgroundColor: 'purple'}: {}]}>
            <Text>{title}</Text>
            <Text>
              SWR: {(withdrawalRate*100.00).toFixed(2)}%
              Return: {(returnRate*100.00).toFixed(2)}%
            </Text>
          </View>
        ))}
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
  annualReturn: PropTypes.number.isRequired,
  withdrawalRate: PropTypes.number.isRequired,
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
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: .85
  },
});

export default MarketAssumptions;
