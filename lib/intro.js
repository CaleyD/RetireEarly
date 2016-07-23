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
});

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.continue = this.continue.bind(this);
    this.onValueChange = (propName, value) => this.setState({[propName]: value});
    this.scrollToSlide = this.scrollToSlide.bind(this);
  }
  render() {
    const incomeEntered = typeof this.state.income === 'number';
    const initialPortfolioEntered = typeof this.state.initialPortfolio === 'number';
    const expensesEntered = typeof this.state.expenses === 'number';

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
        <InputSlide title="What's your current portfolio value?"
          propName='initialPortfolio' nextSlideNumber={1} style={styles.slide1}
          onValueChange={this.onValueChange} scrollToSlide={this.scrollToSlide}
          />
        {initialPortfolioEntered ?
          <InputSlide title="What is your current annual income?"
            propName='income' nextSlideNumber={2} style={styles.slide2}
            onValueChange={this.onValueChange} scrollToSlide={this.scrollToSlide}
            descriptionControls={
              <Text>
                Do not include taxes.
                Be sure to include any contributions to retirement accounts (by you or your employer)
              </Text>
            }
            /> : null
        }
        {incomeEntered ?
          <InputSlide title="What are your current annual expenses?"
            propName='expenses' nextSlideNumber={3} style={styles.slide3}
            onValueChange={this.onValueChange} scrollToSlide={this.scrollToSlide}
            descriptionControls={
              <Text>Do not include taxes</Text>
            }
            />: null
        }
        {expensesEntered ?
          <View style={styles.slide4}>
            <Text>You can play with the values on the next screen.</Text>
            <View style={styles.inputSlideContainer}>
              <TouchableOpacity onPress={ this.continue }>
                <Text style={styles.text}>Got it - get started!</Text>
              </TouchableOpacity>
            </View>
          </View>
          : null
        }
      </ScrollView>
    )
  }
  continue() {
    const { initialPortfolio, income, expenses } = this.state;
    this.props.onContinue({ initialPortfolio, income, expenses });
  }
  scrollToSlide(destinationIndex) {
    this.scrollView.scrollTo({y: 0, x: DEVICE_WIDTH*destinationIndex})
  }
};
Intro.propTypes = {
  onContinue: PropTypes.func.isRequired
};

class InputSlide extends Component {
  constructor(props) {
    super(props);
    const {propName, scrollToSlide, nextSlideNumber, onValueChange} = props;
    this.state = {
      value: undefined,
      entered: false
    };
    this.nextClicked = () => scrollToSlide(nextSlideNumber);
    this.onValueChange = (num) => this.setState({value: num});
    this.onSlidingComplete = (num) => {
      this.setState({value: num, entered: true});
      onValueChange(propName, num);
    }
  }
  render() {
    const {style, title, descriptionControls} = this.props;
    const value = this.state.value;
    return (
      <View style={style}>
        <View style={styles.inputSlideContainer}>
          <Text style={ styles.headerText }>{title}</Text>
          <View style={styles.details}>{descriptionControls}</View>
          <Text style={styles.selectedValue}>
            { typeof value === 'number' ? formatMoney(value) : '$___' }
          </Text>
          {this.state.entered ?
            <TouchableOpacity onPress={this.nextClicked}>
              <Text style={styles.text}>next</Text>
            </TouchableOpacity> : null
          }
        </View>
        <VerticalSlider
          onValueChange={this.onValueChange}
          onSlidingComplete={this.onSlidingComplete}/>
      </View>
    );
  }
}
