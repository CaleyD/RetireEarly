// TODO: drag/drop income periods
// TODO: minimized/expanded View
// TODO: edit mode (with sort and delete icons)
// TODO: swipe to delete
// TODO: drop shadow on header when listview is not at the top
// TODO: add cancel button to new income insertion control
// TODO: fix layout bug after resetting view
import React, { PropTypes } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  ListView,
  LayoutAnimation,
  ProgressViewIOS,
  ScrollView,
  PanResponder,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {QuickDollarInputSidebar, SidebarInputTrigger} from './quick-dollar-input-sidebar';
import PureComponent from './pureComponent';
import styles from './styles.js';
import MarketAssumptions from './marketAssumptions';

var scenarioStore = require('./scenarioStore');
var calc = require('./calculator.js');
import formatMoneyCompact from './formatMoney';

var listview;
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class ProgressRow extends PureComponent {
  render() {
    var year = new Date().getYear() + 1900 + this.props.year;
    return (
      <View style={styles.progressRow}>
        <Text style={styles.progressRowYear}>{year}</Text>

        <View style={{flex: 1}}>
          {this.props.children}
        </View>
      </View>
    );
  }
}
ProgressRow.propTypes = {
  children: PropTypes.element.isRequired,
  year: PropTypes.number.isRequired
}

class IncomeExpenseRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {top: null};
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now

        this._lastLayoutTop = this._layoutTop;
        this._listViewStickyHeaderIndices = listview.props.stickyHeaderIndices;
        listview.setNativeProps({
          scrollEnabled: false,
          stickyHeaderIndices: null
        });
        this.setState({top: gestureState.dy + this._lastLayoutTop, moving: true});
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}

        this.setState({top: gestureState.dy + this._lastLayoutTop, moving: true});

        // scroll the parent scroll view if the gesture position is within 44 px

      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.setState({top: 0, moving: false});
        listview.setNativeProps({
          scrollEnabled: true,
          stickyHeaderIndices: this._listViewStickyHeaderIndices
        });
        // where should this row be moved to?
        //throw new Error(listview.)
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }
  componentWillUpdate() {
    LayoutAnimation.spring();
  }
  render() {
    rowData = this.props.rowData;
    return (
      <View
        onLayout={(event)=>this._layoutTop = event.nativeEvent.layout.y}
        style={[
          styles.incomeExpenseRow,
          {top: this.state.top, transform: [{'translate':[0,0,1]}] },
          this.state.moving ? {
            width: Dimensions.get('window').width,
            position: 'absolute',
            opacity: .8,
            shadowColor: '#000000',
            shadowOpacity: 0.8,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 2
            }} : {}
        ]}
        >

        {!this.props.hideDeleteAndReorder ?
          (this.props.allowDelete ?
            <View {...this._panResponder.panHandlers}>
              <Icon name="reorder" size={24} color="#AAA" />
            </View>
            :
            <Icon name="reorder" size={24} color="#BBB" />
          )
          : null
        }

        {
          [
            {title: 'Income', field: 'annualIncome'},
            {title: 'Expenses', field: 'annualSpending'},
          ].map((item)=>(
            <View style={[styles.progressRowColumn, {alignItems: 'stretch'}]} key={item.field}>
              <SidebarInputTrigger value={rowData[item.field]}
                onChange={(num)=>{
                  var attrs = {};
                  attrs[item.field] = num;
                  scenarioStore.updateIncomePeriod(rowData.period, attrs);
                }}
                renderChildren={(isSelected)=>(
                  <View style={isSelected ?
                      styles.progressRowColumnSelected : styles.progressRowColumn}>
                    <Text>{item.title}</Text>
                    <Text>{formatMoneyCompact(rowData[item.field])}</Text>
                  </View>
                )}/>
            </View>
          ))
        }

        <View style={styles.progressRowColumn}>
          <Text>Savings rate</Text>
          <Text>
            {Math.round(100 * (rowData.annualIncome-rowData.annualSpending)/rowData.annualIncome)}
            %
          </Text>
        </View>

        {!this.props.hideDeleteAndReorder ?
          (this.props.allowDelete ?
            <TouchableHighlight onPress={()=>scenarioStore.removeIncomePeriod(this.props.rowData.period)}>
              <Icon name="close" size={30} color="#900" />
            </TouchableHighlight>
            :
            <Icon name="close" size={30} color="#CCC" />
          )
          : null
        }
      </View>
    );
  }
}
IncomeExpenseRow.propTypes = {
  rowData: PropTypes.object.isRequired,
  hideDeleteAndReorder: PropTypes.bool,
  allowDelete: PropTypes.bool
}

class Progress extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedField: undefined
    };
  }
  getDataSource() {
    var scenario = this.props.scenario;
    var retirementOutlook = calc.calculate(scenario);
    var annualBalances = retirementOutlook.annualBalances;
    var listItems = annualBalances.map(function(entry, index) {
      return { type: 'year', portfolioValue: entry, year: index + 1 };
    });
    incomeIndices = [];

    var currentYearNumber = 0;
    scenario.incomePeriods.forEach((period) => {
      listItems.splice(currentYearNumber, 0, {
        type: 'income/expenses',
        annualIncome: period.annualIncome, annualSpending: period.annualSpending,
        period: period
      });
      incomeIndices.push(++currentYearNumber);
      currentYearNumber += (period.years || 0);
    });

    return ds.cloneWithRows(listItems);
  }
  render() {
    var scenario = this.props.scenario;
    var retirementOutlook = this.props.retirementOutlook;

    return (
      <ListView
        ref={(ctl)=>listview = ctl}
        enableEmptySections={true}
        dataSource={this.getDataSource()}
        stickyHeaderIndices={incomeIndices}
        renderHeader={()=>this.renderInitialPortfolioValueRow()}
        renderRow={(rowData) =>
          rowData.type === 'year' ?
            <View>
              {this.state.selectedRow===rowData.year ?
                <TouchableHighlight onPress={()=>{
                  this.setState({selectedRow: null});
                  scenarioStore.insertIncomePeriod(rowData.year-1);
                }}>
                  <View style={styles.incomeExpenseRow}>
                    <Icon name="plus-square-o" size={24} color="#AAA" />
                    <Text>Modify income/expenses</Text>
                  </View>
                </TouchableHighlight>
                : null
              }
              <ProgressRow year={rowData.year}>
                <TouchableHighlight onPress={()=>this.setState({selectedRow: rowData.year===this.state.selectedRow ? null : rowData.year})}>
                  <View style={{flexDirection: 'row', height: 30, alignItems: 'center'}}>
                    <ProgressViewIOS
                      style={{marginRight: 10, flex: 1, alignSelf: 'center'}}
                      progress={rowData.portfolioValue / retirementOutlook.retirementPortfolioValue}>
                    </ProgressViewIOS>

                    <Text style={styles.progressRowAmount}>{formatMoneyCompact(rowData.portfolioValue)}</Text>
                  </View>
                </TouchableHighlight>
              </ProgressRow>
            </View>
            :
            <IncomeExpenseRow rowData={rowData} hideDeleteAndReorder={this.props.hideDeleteAndReorder}
              allowDelete={scenario.incomePeriods[0] !== rowData.period}/>
          }
      />
    );
  }
  renderInitialPortfolioValueRow() {
    // TODO - allow negative values for people in debt starting out
    let initialPortfolioValue = this.props.scenario.initialPortfolioValue;
    var isSelected = this.state.selectedField === 'initialPortfolioValue';
    return (
      <View style={{backgroundColor: '#fff', borderTopColor: '#ccc', borderTopWidth: 1}}>
        <ProgressRow year={0}>
          <SidebarInputTrigger
            value={initialPortfolioValue}
            onChange={(num)=>scenarioStore.setInitialPortfolioValue(num)}
            renderChildren={(selected)=>(
              <View style={{
                  alignItems: 'center',
                  height: 44,
                  backgroundColor: selected ? 'orange' : 'transparent',
                  flexDirection: 'row'}}>
                <Text style={{flex: 1}}>Initial portfolio value</Text>
                <Text style={styles.progressRowAmount}>{formatMoneyCompact(initialPortfolioValue)}</Text>
              </View>
            )}
            />
        </ProgressRow>
      </View>
    );
  }
}
Progress.propTypes = {
  scenario: PropTypes.object.isRequired,
  retirementOutlook: PropTypes.object.isRequired,
  hideDeleteAndReorder: PropTypes.bool
};

export default class OutlookTablePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      scenario: null,
      sideBarVisible: false
    }
    scenarioStore.getScenario((err, scenario) => this.setState({scenario}));
    this.scenarioListener = scenarioStore.addListener('change',
      (scenario) => { this.setState({scenario})}
    );
  }

  componentWillUnmount() {
    this.scenarioListener.remove();
  }

  render() {
    var scenario = this.state.scenario;

    if(scenario == null) {
      // scenario not yet loaded
      return <View />
    }

    var retirementOutlook = calc.calculate(scenario);

    return (
      <View style={styles.outlookPage}>

        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.welcome}>Early Retirement Calculator!</Text>
            <Text style={styles.instructions}>Your path to financial independence</Text>
          </View>

          <TouchableHighlight onPress={()=>scenarioStore.resetScenario()}>
            <Text style={styles.pageHeaderButton}>RESET</Text>
          </TouchableHighlight>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
          <View style={[styles.container, {backgroundColor: 'white', flex: .8}]}>

            <Progress scenario={scenario} retirementOutlook={retirementOutlook}
              hideDeleteAndReorder={this.state.sideBarVisible}/>

            <View style={{
                height: 50, backgroundColor: 'pink', flexDirection: 'row',
                alignItems: 'stretch', justifyContent: 'center'
              }}>

              <View style={{flex: 3, backgroundColor: 'green', borderTopWidth: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white'}}>{Math.round(10*retirementOutlook.yearsToRetirement)/10} years</Text>
                <Text style={{color: 'white'}}>{formatMoneyCompact(retirementOutlook.retirementPortfolioValue)}</Text>
              </View>

            </View>
          </View>

          <QuickDollarInputSidebar
            onVisibilityChange={(visible)=>this.setState({sideBarVisible: visible})} />
        </View>

        <View>
          <MarketAssumptions scenario={scenario}/>
        </View>
      </View>
    );
  }
}
