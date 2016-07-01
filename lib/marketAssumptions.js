import React, { PropTypes } from 'react';
import PureComponent from './pureComponent';
import {
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';

var scenarioStore = require('./scenarioStore');

const CARD_PREVIEW_WIDTH = 20
const CARD_MARGIN = 5;
const CARD_WIDTH = Dimensions.get('window').width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;

class MarketAssumptions extends PureComponent {
  render() {
    return (
      <ScrollView
        style={styles.container}
        automaticallyAdjustInsets={false}
        horizontal={true}
        decelerationRate={0}
        snapToInterval={CARD_WIDTH + CARD_MARGIN*2}
        snapToAlignment="start"
        contentContainerStyle={styles.content}
        >
        {['conservative', 'medium', 'aggressive', 'custom'].map((name, idx) => {
          <View key={name}
            style={styles.card}>
            <Text>{name}</Text>
          </View>
        })}
      </ScrollView>
    );
  }
}
MarketAssumptions.propTypes = {
  scenario: PropTypes.object.isRequired
};

var styles = StyleSheet.create({
  _card: {
    backgroundColor: '#eeeeee',
    marginBottom: 3,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 2,
    overflow: 'hidden',

    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  },

  container: {
    flex: 1,
    height: 300,
    backgroundColor: '#F5FCFF',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: CARD_PREVIEW_WIDTH,
    alignItems: 'center',
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#ccc',
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default MarketAssumptions;
