'use strict';
import React, { PropTypes } from 'react';
import {
	Dimensions, NavigationExperimental, View, Text, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import Home from './components/Home/Home.js';
import HomeHeader from './components/Home/Home.Header.js'
import Intro from './components/Intro/Intro.js';
import QuickEditPanel from './components/QuickEditPanel/QuickEditPanel.js';
import { navigatePop } from './reducers/navigation.js';
import Menu from './components/Menu.js';
const SideMenu = require('react-native-side-menu');

const {
	CardStack: NavigationCardStack,
	Header: NavigationHeader
} = NavigationExperimental;

const Routes = ({ navigationState, backAction, loading }) => {
	let menu;

	if(loading) {
		return <View><Text>Loading</Text></View>;
	}

	return (
		<SideMenu menu={<Menu/>} ref={c=>menu = c}
			openMenuOffset={Dimensions.get('window').width * .85}
			edgeHitWidth={0}
			>
			<NavigationCardStack
				navigationState={navigationState}
				onNavigateBack={backAction}
				style={styles.container}
				direction='horizontal'
				renderOverlay={props => {
					if(props.scene.route.hideHeader) {
						return undefined;
					}
					if(props.scene.route.key === 'Home') {
						return (
							<HomeHeader
								{...props}
								onNavigateBack={backAction}
								openMenu={()=>menu.openMenu(true)}
								/>
						);
					}
					return (
						<NavigationHeader
							style={{backgroundColor: '#33cc33'}}
							{...props}
							onNavigateBack={backAction}
							renderTitleComponent={{scene} => (
								<NavigationHeader.Title>
									{scene.route.title}
								</NavigationHeader.Title>
							)}
						/>
					);
				}}
				renderScene={renderScene}
			/>
		</SideMenu>
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
			return <Home/>;
		case 'QuickEditPanel':
			return <QuickEditPanel {...scene.route} />;
	}
	throw new Error('Unknown route key: ' + scene.route.key);
}

export default connect(
	({ storage, navigation }) => ({
    loading: !storage.storageLoaded,
		navigationState: navigation
  }),
	{
		backAction: navigatePop
	}
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
