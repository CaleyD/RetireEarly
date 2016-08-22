'use strict';
// TODO: drop shadow on header when listview is not at the top
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { reset } from '../reducers/scenario.js';

function Menu({dispatch}) {
  return (
    <View style={{marginVertical: 50}}>

      <Text style={{fontSize: 18, color: 'blue'}}>Retire Early</Text>

      <TouchableOpacity onPress={() => dispatch(reset())}>
        <Text style={{height: 44}}>RESET</Text>
      </TouchableOpacity>

    </View>
  );
}
Menu.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(Menu);
