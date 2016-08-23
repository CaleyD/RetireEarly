'use strict';
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet, ScrollView, Text, TouchableOpacity, View, Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import Dial from 'react-native-dial';
import formatMoney from '../../formatMoney';
import { setInitialPortfolio, editPeriod } from '../../reducers/scenario.js'

const DEVICE_WIDTH = Dimensions.get('window').width;

const slide = Object.freeze({
  paddingTop: 50,
  paddingBottom: 30,
  width: DEVICE_WIDTH,
  flex: 1,
  flexDirection: 'column',
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

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = { scrollEnabled: true };
    this.continue = this.continue.bind(this);
    this.onValueChange = (propName, value) => this.setState({[propName]: value});
    this.scrollToNextSlide = this.scrollToNextSlide.bind(this);
    this.enableScroll = (enabled) => {
      if(!enabled) {
        const currentIndex = Math.floor(this._currentScrollX / DEVICE_WIDTH) || 0;
        this.scrollView.scrollTo({y: 0, x: DEVICE_WIDTH*(currentIndex)});
      }
      this.setState({ scrollEnabled: enabled});
    }
    this.onScroll = (evt) => this._currentScrollX = evt.nativeEvent.contentOffset.x;
  }
  render() {
    const entered = (propName) => typeof this.state[propName] === 'number';

    return (
      <ScrollView
        ref={c => this.scrollView = c}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate="fast"
        snapToInterval={DEVICE_WIDTH}
        snapToAlignment="start"
        bounces={false}
        onScroll={this.onScroll}
        scrollEnabled={this.state.scrollEnabled}
      >

        <View style={styles.slide4}>
          <Text>Welcome!</Text>
          <TouchableOpacity onPress={this.scrollToNextSlide}>
            <Text>next</Text>
          </TouchableOpacity>
        </View>

        <InputSlide title="How old are you?"
          propName='age' style={styles.slide3}
          onValueChange={this.onValueChange} scrollToNextSlide={this.scrollToNextSlide}
          enableScroll={this.enableScroll} minimumValue={0} maximumValue={1080}
          valueFormatter={ageFormatter}
          getDialValue={num => Math.round(num * 75 / 1080)}
          />
        {entered('age') ?
          <InputSlide title="What's your current portfolio value?"
            propName='initialPortfolio' style={styles.slide1}
            onValueChange={this.onValueChange} scrollToNextSlide={this.scrollToNextSlide}
            enableScroll={this.enableScroll} minimumValue={-20000000}
            /> : null
        }
        {entered('initialPortfolio') ?
          <InputSlide title="What is your current annual income?"
            propName='income' style={styles.slide2}
            onValueChange={this.onValueChange} scrollToNextSlide={this.scrollToNextSlide}
            enableScroll={this.enableScroll}
            descriptionControls={
              <Text>
                Do not include taxes.
                Be sure to include any contributions to retirement accounts (by you or your employer)
              </Text>
            }
            /> : null
        }
        {entered('income') ?
          <InputSlide title="What are your current annual expenses?"
            propName='expenses' style={styles.slide3}
            onValueChange={this.onValueChange} scrollToNextSlide={this.scrollToNextSlide}
            enableScroll={this.enableScroll}
            descriptionControls={
              <Text>Do not include taxes</Text>
            }
            />: null
        }
        {entered('expenses') ?
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
    const { setInitialPortfolio, editPeriod, firstIncomePeriod } = this.props;
    setInitialPortfolio(initialPortfolio);
    editPeriod(firstIncomePeriod, { income, expenses });
  }
  scrollToNextSlide() {
    const currentIndex = Math.floor(this._currentScrollX / DEVICE_WIDTH) || 0;
    this.scrollView.scrollTo({y: 0, x: DEVICE_WIDTH*(currentIndex + 1)});
  }
}
Intro.propTypes = {
  setInitialPortfolio: PropTypes.func.isRequired,
  editPeriod: PropTypes.func.isRequired,
  firstIncomePeriod: PropTypes.object.isRequired
};

function getDialValueForDollar(num) {
  if(num < 720)
   return Math.round(num/360*50)*1000;
  if(num < 1440)
    return 100000 + Math.round((num-720)/360*50)*5000
  return 100000 + 500000 + Math.round((num-1440)/360*50)*10000
}

class InputSlide extends Component {
  constructor(props) {
    super(props);
    const {
      propName, onValueChange,
      enableScroll, getDialValue = getDialValueForDollar
    } = props;
    this.state = {
      value: undefined,
      entered: false
    };
    this.onValueChange = (num) => this.setState({value: getDialValue(num)});
    this.onSlidingBegin = () => enableScroll(false);
    this.onSlidingComplete = (num) => {
      this.setState({value: getDialValue(num), entered: true});
      onValueChange(propName, getDialValue(num));
      enableScroll(true);
    }
  }
  render() {
    const {
      style, title, descriptionControls,
      minimumValue = 0, maximumValue = 20000000,
      valueFormatter = moneyFormatter
    } = this.props;
    const value = this.state.value;
    return (
      <View style={style}>
        <View style={styles.inputSlideContainer}>
          <Text style={ styles.headerText }>{title}</Text>
          <View style={styles.details}>{descriptionControls}</View>
          <Text style={styles.selectedValue}>
            { valueFormatter(value) }
          </Text>
        </View>
        <Dial
          style={{width: 140, height: 140, alignSelf: 'center'}}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          onValueChange={this.onValueChange}
          onSlidingBegin={this.onSlidingBegin}
          onSlidingComplete={this.onSlidingComplete}/>
        {this.state.entered ?
          <TouchableOpacity onPress={this.props.scrollToNextSlide}>
            <Text style={styles.text}>next</Text>
          </TouchableOpacity> : null
        }
      </View>
    );
  }
}
InputSlide.propTypes = {
  style: PropTypes.any,
  title: PropTypes.string.isRequired,
  propName: PropTypes.string.isRequired,
  descriptionControls: PropTypes.node,
  minimumValue: PropTypes.number,
  maximumValue: PropTypes.number,
  valueFormatter: PropTypes.func,
  onValueChange: PropTypes.func.isRequired,
  scrollToNextSlide: PropTypes.func.isRequired,
  getDialValue: PropTypes.func,
  enableScroll: PropTypes.func
};


function moneyFormatter(value) {
  return typeof value === 'number' ? formatMoney(value) : '$___'
}
function ageFormatter(value) {
  return typeof value === 'number' ? value + ' years old' : '___ years old';
}

export default connect(
  ({ scenario }) => ({ firstIncomePeriod: scenario.incomePeriods[0] }),
  { setInitialPortfolio, editPeriod }
)(Intro);
