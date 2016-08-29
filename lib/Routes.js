'use strict';
import React, { PropTypes } from 'react';
import {
	Dimensions, NavigationExperimental, View, StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import Home from './components/Home/Home.js';
import HomeHeader from './components/Home/Home.Header.js';
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

	if (loading) {
		return <View />;
	}

	return (
		<SideMenu menu={<Menu/>} ref={c=>{menu = c;}}
			openMenuOffset={Dimensions.get('window').width * .85}
			edgeHitWidth={0}
			>
			<NavigationCardStack
				navigationState={navigationState}
				onNavigateBack={backAction}
				style={styles.container}
				direction='horizontal'
				renderOverlay={headerProps => {
					if (headerProps.scene.route.hideHeader) {
						return null;
					}
					if (headerProps.scene.route.key === 'Home') {
						return (
							<HomeHeader
								style={styles.header}
								{...headerProps}
								onNavigateBack={backAction}
								openMenu={()=>menu.openMenu(true)}
								/>
						);
					}
					return (
						<NavigationHeader
							style={styles.header}
							{...headerProps}
							onNavigateBack={backAction}
							renderTitleComponent={({scene}) =>
								<NavigationHeader.Title>
									{scene.route.title}
								</NavigationHeader.Title>
							}
						/>
					);
				}}
				renderScene={renderScene}
			/>
		</SideMenu>
	);
};

Routes.propTypes = {
	loading: PropTypes.bool.isRequired,
	navigationState: PropTypes.object,
	backAction: PropTypes.func.isRequired
};

function renderScene ({scene}) {
	switch (scene.route.key) {
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
)(Routes);

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: { backgroundColor: '#33CC33' }
});
