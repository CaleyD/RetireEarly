'use strict';
import React, { PropTypes } from 'react';
import { NavigationExperimental, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Home from './components/Home/Home.js';
import Intro from './components/Intro/Intro.js';
import QuickEditPanel from './components/QuickEditPanel/QuickEditPanel.js';
import { navigatePop } from './reducers/navigation.js';

const {
	Transitioner: NavigationTransitioner,
	Card: NavigationCard,
	CardStack: NavigationCardStack,
	Header: NavigationHeader
} = NavigationExperimental;

const Routes = ({ navigationState, backAction, loading }) => {

	if(loading) {
		return <View><Text>Loading</Text></View>;
	}

	return (
		<NavigationCardStack
			navigationState={navigationState}
			onNavigateBack={backAction}
			style={styles.container}
			direction={navigationState.routes[navigationState.index].key === 'Modal' ?
				'vertical' : 'horizontal'
			}
			renderOverlay={props => (
				<NavigationHeader
					{...props}
					onNavigateBack={backAction}
					renderTitleComponent={props => {
						const title = props.scene.route.title
						return <NavigationHeader.Title>{title}</NavigationHeader.Title>
					}}
					// When dealing with modals you may also want to override renderLeftComponent...
				/>
			)}
			renderScene={renderScene}
		/>
	);
};

Routes.propTypes = {
	navigationState: PropTypes.object,
	backAction: PropTypes.func.isRequired
};

function renderScene({scene}) {
	switch(scene.route.key) {
		case 'Intro':
			return <Intro />;
		case 'Home':
			return <Home />;
		case 'QuickEditPanel':
			return <QuickEditPanel {...scene.route} />;
	}
	throw new Error('Unknown route key: ' + route.key);
}

export default connect(
	({ storage, navigation }) => ({
    loading: !storage.storageLoaded,
		navigationState: navigation
  }),
	{ backAction: navigatePop }
)(Routes)

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

/*
class Outlook extends PureComponent {
  render() {
    var yearsToRetirement = Math.round(10 * this.props.retirementOutlook.yearsToRetirement) / 10;
    return (
      <TouchableHighlight underlayColor='#99d9f4'
        onPress={()=>this.navigateToDetails()}
        style={{
          backgroundColor: 'white',
          padding: 7,
          alignSelf: 'stretch'
        }}>
        <View>
          {
            yearsToRetirement === NaN ?
              <Text>
                You will need {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolio)} to
                retire but you will never get there because you are outspending your income.
              </Text>
            : yearsToRetirement <= 0 ?
              <Text>
                You need {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolio)} and
                you already have it - you can retire now!
              </Text>
            :
              <Text>
                You can retire in {yearsToRetirement} {yearsToRetirement === 1 ? 'year ' : 'years '}
                with {formatMoneyCompact(this.props.retirementOutlook.retirementPortfolio)}
              </Text>
          }
          <Text style={styles.buttonText}>Go</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
*/
