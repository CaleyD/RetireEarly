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
  },
  incomeExpenseRow: {
    height: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderTopColor: '#ddd',
    borderBottomColor: '#eee',
    overflow: 'hidden'
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressRowYear: {
    width: 90,
    color: 'gray',
    textAlign: 'right',
    paddingRight: 10
  },
  progressRowAmount: {
    width: 60,
    color: 'gray',
    textAlign: 'center'
  },
  progressBar: {
    marginRight: 10,
    flex: 1,
    alignSelf: 'center'
  },
  progressRowColumn: {
    height: 44,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  progressRowColumnSelected: {
    height: 44,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange'
  },
  incomeExpenseLabel: {
     textAlign: 'center'
  },
  incomeExpenseValue: {
     textAlign: 'center'
  },
  outlookPage: {
    flexDirection: 'column',
    flex: 1
  },
  pageHeader: {
    paddingTop: 20
  },
  pageHeaderButton: {
    height: 44
  },
  iconContainer: {
    height: 44,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clickableIcon: {
    fontSize: 30
  },
  clickableIconDisabled: {
    fontSize: 30,
    color: '#EEE'
  }
});
