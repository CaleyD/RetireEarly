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
  paddingTop: 50,
  paddingBottom: 30,
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
  },
  headerText: {
    color: 'white',
    fontSize: 25
  },
  details: {
    flex: 1
  }
})

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  render() {
    const {
      incomeEntered, initialPortfolioEntered, expensesEntered
    } = this.state;
    return (
      <ScrollView
        ref={c => this.scrollView = c}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate="fast"
        snapToInterval={DEVICE_WIDTH}
        snapToAlignment="start"
        bounces={false}
      >
        {this.renderInputSlide('initialPortfolio', 1, styles.slide1,
          'What\'s your current portfolio value?'
        )}
        {initialPortfolioEntered ?
          this.renderInputSlide('income', 2, styles.slide2,
            'What are your current annual expenses?',
            <Text>
              Do not include taxes.
              Be sure to include any contributions to retirement accounts (by you or your employer)
            </Text>
          ) : null
        }
        {incomeEntered ?
          this.renderInputSlide('expenses', 3, styles.slide3,
            'What are your current annual expenses?',
            <Text>Do not include taxes</Text>
          ) : null
        }
        {expensesEntered ?
          <View style={styles.slide4}>
            <Text>You can play with the values on the next screen.</Text>
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
  renderInputSlide(prop, nextSlideNumber, style, title, descriptionControls) {
    return (
      <View style={style}>
        <View style={styles.inputSlideContainer}>
          <Text style={ styles.headerText }>{title}</Text>
          <View style={styles.details}>
            {descriptionControls}
          </View>
          { this.renderSelectedValue(prop) }
          { this.renderNextButton(nextSlideNumber, prop) }
        </View>
        { this.renderSlider(prop) }
      </View>
    );
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
    const value = this.state[propName];
    return (
      <Text style={styles.selectedValue}>
        { typeof value === 'number' ? formatMoney(value) : '$___' }
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
