'use strict';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'green',
    alignItems: 'stretch'
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
    borderBottomWidth: 1,
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
    color: 'white',
    paddingLeft: 10
  },
  progressRowAmount: {
    width: 60,
    color: 'white',
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
