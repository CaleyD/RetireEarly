'use strict';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { reset } from '../reducers/scenario.js';
import { navigateReset } from '../reducers/navigation.js';
import Communications from 'react-native-communications';

function Menu({reset, navigateReset}) {
  return (
    <View style={{marginVertical: 50}}>

      <Text style={{fontSize: 18, color: 'blue'}}>Retire Early</Text>

      <TouchableOpacity onPress={() => {
          reset();
          navigateReset([{key: 'Intro', hideHeader: true}], 0);
        }}>
        <Text style={{height: 44}}>RESET</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Communications.email()}>
        <Text style={{height: 44}}>Feedback</Text>
      </TouchableOpacity>

    </View>
  );
}
Menu.propTypes = {
  reset: PropTypes.func.isRequired,
  navigateReset: PropTypes.func.isRequired
};

export default connect(null, { reset, navigateReset })(Menu);
