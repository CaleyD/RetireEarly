import React, {PropTypes, Component} from 'react';
import {ART, PanResponder, View} from 'react-native';
const { Surface, Shape } = ART;

export default class Chart extends Component {
  constructor (props) {
    super(props);
    this.state = {};
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

        this.setState({panning: true});
        this.props.onPanning(true);
        // gestureState.{x,y}0 will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        this.setState({panning: false});
        this.props.onPanning(false);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        this.setState({panning: false});
        this.props.onPanning(false);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => true
    });
  }
  render () {
    const { outlook, height, width } = this.props;

    const balances = outlook.annualBalances.slice(0, 20);
    const retirementPortfolio = outlook.retirementPortfolio;

    const maxValue = balances.
      map(({balance})=>balance).reduce((a, b)=>Math.max(a, b));
    const minValue = balances.
      map(({balance})=>balance).reduce((a, b)=>Math.min(a, b));
    const range = maxValue - minValue;

    const getYCoordForBalance = balance =>
      height - (balance - minValue) / range * height;
    const getXCoordForYear = year => year / balances.length * width;
    const getCoord = (year, balance) =>
      getXCoordForYear(year) + ',' + getYCoordForBalance(balance);

    const pathBalances = balances.reduce(
      (path, { balance, year }) => path + ' ' + getCoord(year, balance),
      'M'
    );

    return (
      <View {...this._panResponder.panHandlers}>
        <Surface width={width || 300} height={height || 300}
          style={{backgroundColor: 'white'}}>
          <Shape
            d={
              'M 0,' + getYCoordForBalance(0) + ' ' + width + ',' +
              getYCoordForBalance(0)
            }
            stroke="#CECECE" strokeWidth={1} />
          <Shape
            d={
              'M 0,' + getYCoordForBalance(retirementPortfolio) + ' ' + width +
              ',' + getYCoordForBalance(retirementPortfolio)
            }
            stroke="#ff6666" strokeWidth={1} />
          <Shape d={pathBalances}
            stroke={this.state.panning ? '#0000FF' : '#00FF00'}
            strokeWidth={1} />
        </Surface>
      </View>
    );
  }
}
Chart.propTypes = {
  outlook: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};
