'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { PropTypes } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { reset } from '../reducers/scenario.js';

export default function Menu({dispatch}) {
  return (
    <View style={{marginVertical: 50}}>
      <Text>Hi</Text>

      <TouchableOpacity onPress={() => dispatch(reset())}>
        <Text style={{height: 44}}>RESET</Text>
      </TouchableOpacity>

    </View>
  );
}
Menu.propTypes = {
  dispatch: PropTypes.func.isRequired
};
