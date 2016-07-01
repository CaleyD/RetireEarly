import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'green',
    alignItems: 'stretch'
  },
  welcome: {
    fontSize: 20,
    fontFamily: 'Verdana',
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    flex: .4,
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center'
  },
  outlook: {
    backgroundColor: 'white',
    padding: 7,
    alignSelf: 'stretch'
  }
});
