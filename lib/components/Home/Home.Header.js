import React, { PropTypes } from 'react';
import {
  View, NavigationExperimental, Text, TouchableOpacity
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  toggleViewExpanded, toggleMarketAssumptions
} from '../../reducers/ui.js';
import { connect } from 'react-redux';
import { calculate } from '../../calculator.js';
import formatMoney from '../../formatMoney.js';
const { Header: NavigationHeader } = NavigationExperimental;

function HomeHeader (props) {
  const {
    yearsUntilFI, openMenu, toggleViewExpanded, toggleMarketAssumptions,
    isExpanded, retirementPortfolio
  } = props;

  return (
    <NavigationHeader
      {...props}
      renderTitleComponent={() => {
        return (
          <NavigationHeader.Title>
            {Math.round(10 * yearsUntilFI) / 10} Years
            {'\n'}
            <Text style={{fontSize: 14}}>
              {formatMoney(retirementPortfolio)}
            </Text>
          </NavigationHeader.Title>
        );
      }}
      renderRightComponent={
        () =>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={toggleMarketAssumptions}
              style={{paddingHorizontal: 8}}>
              <Ionicon name="md-options" style={{fontSize: 24, color: '#FFF'}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleViewExpanded}
              style={{paddingHorizontal: 8}}>
              <FontAwesome name={isExpanded ? "compress" : "expand"}
                style={{fontSize: 24, color: '#FFF'}} allowFontScaling={false}/>
            </TouchableOpacity>
          </View>
      }
      renderLeftComponent={
        () =>
          <TouchableOpacity onPress={openMenu}>
            <Ionicon name="md-menu" style={{fontSize: 30, color: '#FFF'}}
              allowFontScaling={false}/>
          </TouchableOpacity>
      }
    />
  );
}
HomeHeader.propTypes = {
  yearsUntilFI: PropTypes.number.isRequired,
  openMenu: PropTypes.func.isRequired,
  toggleViewExpanded: PropTypes.func.isRequired,
  toggleMarketAssumptions: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  retirementPortfolio: PropTypes.number.isRequired
};

export default connect(
	({ scenario, ui }) => ({
		yearsUntilFI: calculate(scenario).yearsToRetirement,
    retirementPortfolio: calculate(scenario).retirementPortfolio,
    isExpanded: ui.expanded
  }),
	{
		toggleViewExpanded,
		toggleMarketAssumptions
	}
)(HomeHeader);
