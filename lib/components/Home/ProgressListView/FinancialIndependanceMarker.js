import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

export default function FinancialIndependanceMarker () {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text>FINANCIAL INDEPENDENCE!!!</Text>
      <TouchableOpacity onPress={()=>({})}>
        <Ionicon
          name="ios-more"
          style={{fontSize: 30, color: 'white'}}
          allowFontScaling={false}/>
      </TouchableOpacity>
    </View>
  );
}
