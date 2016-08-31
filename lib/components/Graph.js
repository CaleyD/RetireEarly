import React, {PropTypes, Component} from 'react';
import {ART} from 'react-native';
const {
  Surface,
  Shape,
} = ART;

export default class Chart extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
  render () {
    const { outlook, height, width } = this.props;

    const balances = outlook.annualBalances.slice(0, 20);

    const strokeWidth = 3;//(height - 4) / (balances.length + 1);
    const retirementPortfolio = outlook.retirementPortfolio;

    const maxValue = balances.map(({balance})=>balance).reduce((a,b)=>Math.max(a,b));
    const minValue = balances.map(({balance})=>balance).reduce((a,b)=>Math.min(a,b));
    const range = maxValue - minValue;

    const getYCoordForBalance = balance => height - (balance - minValue) / range * height;
    const getXCoordForYear = year => year / balances.length * width;

    const pathBalances = balances.reduce(
      (path, { balance, year }) =>
        path + ' ' + getXCoordForYear(year) + ',' + getYCoordForBalance(balance),
      'M');

    return (
      <Surface width={width || 300} height={height || 300} style={{backgroundColor: 'white'}}>
        <Shape
          d={'M 0,' + getYCoordForBalance(0) + ' ' + width + ',' + getYCoordForBalance(0)}
          stroke="#CECECE" strokeWidth={1} />
        <Shape
          d={'M 0,' + getYCoordForBalance(retirementPortfolio) + ' ' + width + ',' + getYCoordForBalance(retirementPortfolio)}
          stroke="#ff6666" strokeWidth={1} />
        <Shape d={pathBalances} stroke="#0000FF" strokeWidth={strokeWidth} />
      </Surface>
    );
  }
}
Chart.propTypes = {
  outlook: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};
