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
  card: {
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
  cardHeader: {
    backgroundColor: '#ffffff',
    padding: 8
  },
  button: {
    flex: .4,
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  scenarioForm: {
    flex: 1,
    justifyContent: 'center'
  },
  scenarioFormRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#bbbbbb',
    marginLeft: 30
  },
  scenarioFormRowLabel: {
    flex: 0.6,
    paddingTop: 13,
    backgroundColor: 'rgba(52,52,52,0)'
  },
  scenarioFormRowInput: {
    flex: 0.3,
    fontSize: 13,
    padding: 4,
    color: 'black'
  },
  outlook: {
    backgroundColor: 'white',
    padding: 7,
    alignSelf: 'stretch'
  },
  outlookRow: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#cecece',
    flexDirection: 'row'
  },
  roundedTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  },
  roundedBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  },
  rounded: {
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent'
  }
});
