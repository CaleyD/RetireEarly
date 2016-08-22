'use strict';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { reset } from '../reducers/scenario.js';

function Menu({reset}) {
  return (
    <View style={{marginVertical: 50}}>

      <Text style={{fontSize: 18, color: 'blue'}}>Retire Early</Text>

      <TouchableOpacity onPress={reset}>
        <Text style={{height: 44}}>RESET</Text>
      </TouchableOpacity>

    </View>
  );
}
Menu.propTypes = {
  reset: PropTypes.func.isRequired
};

export default connect(null, { reset })(Menu);
