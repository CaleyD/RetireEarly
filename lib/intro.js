'use strict';
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';

const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  slide4: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'purple',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

export default class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Swiper style={styles.wrapper} ref={(c)=>this.swiper = c}
        showsButtons={false} loop={false} index={this.state.index || 0}>
        <View style={styles.slide1}>
          <Text>What is your current portfolio value?</Text>

          <TouchableOpacity onPress={() => this.swiper.scrollBy(1)}>
            <Text style={styles.text}>next</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.slide2}>
          <Text>What is your current income?</Text>

          <TouchableOpacity onPress={() => this.swiper.scrollBy(1)}>
            <Text style={styles.text}>next</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.slide3}>
          <Text>What is your current annual expenses?</Text>

          <TouchableOpacity onPress={() => this.swiper.scrollBy(1)}>
            <Text style={styles.text}>next</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.slide4}>
          <TouchableOpacity onPress={() => this.props.onContinue()}>
            <Text style={styles.text}>Got it - get started!</Text>
          </TouchableOpacity>
        </View>
      </Swiper>
    )
  }
};
Intro.propTypes = {
  onContinue: PropTypes.func.isRequired
};
