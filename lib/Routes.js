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
	Header: NavigationHeader
} = NavigationExperimental;

const Routes = ({ navigationState, backAction, loading }) => {

	if(loading) {
		return <View><Text>Loading</Text></View>;
	}

	return (
		// Redux is handling the reduction of our state for us. We grab the navigationState
		// we have in our Redux store and pass it directly to the <NavigationTransitioner />.
		<NavigationTransitioner
			navigationState={navigationState}
			style={styles.container}
			render={props => (
				// This mimics the same type of work done in a NavigationCardStack component
				<View style={styles.container}>
					<NavigationCard
						// <NavigationTransitioner>s render method passes `navigationState` as a
						// prop to here, so we expand it plus other props out in <NavigationCard>.
						{...props}
						// Transition animations are determined by the StyleInterpolators. Here we manually
						// override the default horizontal style interpolator that gets applied inside of
						// NavigationCard for a vertical direction animation if we are showing a modal.
						// (Passing undefined causes the default interpolator to be used in NavigationCard.)
						style={props.scene.route.key === 'Modal' ?
							NavigationCard.CardStackStyleInterpolator.forVertical(props) :
							undefined
						}
						onNavigateBack={backAction}
						// By default a user can swipe back to pop from the stack. Disable this for modals.
						// Just like for style interpolators, returning undefined lets NavigationCard override it.
						panHandlers={props.scene.route.key === 'Modal' ? null : undefined }
						renderScene={()=>renderScene(props)}
						key={props.scene.route.key}
					/>
					{!props.scene.route.hideHeader ?
						<NavigationHeader
							{...props}
							onNavigateBack={backAction}
							renderTitleComponent={props => {
								const title = props.scene.route.title
								return <NavigationHeader.Title>{title}</NavigationHeader.Title>
							}}
							// When dealing with modals you may also want to override renderLeftComponent...
						/> : null
					}
				</View>
			)}
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
