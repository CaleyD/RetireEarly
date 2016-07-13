'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet, ScrollView, Text, TouchableOpacity, View, Dimensions
} from 'react-native';
import Swiper from 'react-native-swiper';
import { VerticalSlider } from './quick-dollar-input-sidebar';
import formatMoney from './formatMoney';

const DEVICE_WIDTH = Dimensions.get('window').width;

const slide = Object.freeze({
  width: DEVICE_WIDTH,
  flex: 1,
  flexDirection: 'row',
  alignItems: 'stretch'
});
const styles = StyleSheet.create({
  slide1: Object.assign({ backgroundColor: 'blue' }, slide),
  slide2: Object.assign({ backgroundColor: 'orange' }, slide),
  slide3: Object.assign({ backgroundColor: 'green' }, slide),
  slide4: Object.assign({ backgroundColor: 'purple' }, slide),
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  inputSlideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedValue: {
    fontSize: 45,
    color: 'white'
  }
})

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    return (
      <ScrollView
        ref={c => this.scrollView = c}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate={0}
        snapToInterval={DEVICE_WIDTH}
        snapToAlignment="start"
        bounces={false}
      >
        <View style={styles.slide1}>
          <View style={styles.inputSlideContainer}>
            <Text style={ styles.headerText }>
              What is your current portfolio value?
            </Text>
            { this.renderSelectedValue('initialPortfolio') }
            { this.renderNextButton(1, 'initialPortfolio') }
          </View>
          { this.renderSlider('initialPortfolio') }
        </View>
        {this.state.initialPortfolioEntered ?
          <View style={styles.slide2}>
            <View style={styles.inputSlideContainer}>

              <Text style={ styles.headerText }>
                What is your annual income?
              </Text>

              { this.renderSelectedValue('income') }

              <Text>
                Do not include taxes.
                Be sure to include any contributions to retirement accounts (by you or your employer)
              </Text>

              { this.renderNextButton(2, 'income') }
            </View>
            { this.renderSlider('income') }
          </View>
          :
          null
        }
        {this.state.incomeEntered ?
          <View style={styles.slide3}>
            <View style={styles.inputSlideContainer}>

              <Text style={ styles.headerText }>
                What are your current annual expenses?
              </Text>
              <Text>Do not include taxes</Text>

              { this.renderSelectedValue('expenses') }
              { this.renderNextButton(3, 'expenses') }
            </View>
            { this.renderSlider('expenses') }
          </View>
          :
          null
        }
        {this.state.expensesEntered ?
          <View style={styles.slide4}>
            <Text>
              You can play with the values on the next screen.
            </Text>
            <View style={styles.inputSlideContainer}>
              <TouchableOpacity onPress={() => this.continue()}>
                <Text style={styles.text}>Got it - get started!</Text>
              </TouchableOpacity>
            </View>
          </View>
          : null
        }
      </ScrollView>
    )
  }
  renderNextButton(destinationIndex, requiredProp) {
    if(requiredProp && !this.state[requiredProp + 'Entered']) {
      return null;
    }
    return (
      <TouchableOpacity onPress={() =>
          this.scrollView.scrollTo({y: 0, x: DEVICE_WIDTH*destinationIndex})
        }>
        <Text style={styles.text}>next</Text>
      </TouchableOpacity>
    );
  }
  renderSelectedValue(propName) {
    let value = this.state[propName];
    return (
      <Text style={styles.selectedValue}>
        { typeof value === 'number' ? formatMoney(value) : '$???' }
      </Text>
    );
  }
  renderSlider(prop) {
    return (
      <VerticalSlider
        onValueChange={ num => this.setState({[prop]: num}) }
        onSlidingComplete={ num => this.setState(
          {[prop]: num, [prop + 'Entered']: true})
        }/>
    );
  }
  continue() {
    const { initialPortfolio, income, expenses } = this.state;
    this.props.onContinue({ initialPortfolio, income, expenses });
  }
};
Intro.propTypes = {
  onContinue: PropTypes.func.isRequired
};
