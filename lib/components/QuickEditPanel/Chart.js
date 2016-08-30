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

    let pathPreFI = "";
    let pathPostFI = "";

    const strokeWidth = (height - 4) / (outlook.annualBalances.length + 1);
    const retirementPortfolio = outlook.retirementPortfolio;

    const getYCoordForYear = year => 4 + year * (strokeWidth + 1);

    outlook.annualBalances.forEach(({ balance }, index) => {
      const y = getYCoordForYear(index);
      const percentageOfFI = balance / retirementPortfolio;
      const path =
        "M 0," + y + " " + (percentageOfFI * width || 0) + "," + y + " ";
      if (balance > retirementPortfolio) {
        pathPostFI += path;
      } else {
        pathPreFI += path;
      }
    });

    return (
      <Surface width={width || 300} height={height || 300}>
        <Shape d={pathPreFI} stroke="#0000FF" strokeWidth={strokeWidth} />
        <Shape d={pathPostFI} stroke="#00FF00" strokeWidth={strokeWidth} />
        <Shape d={'M 0,1 50,1'} stroke="#FF0000" strokeWidth={.5} />
      </Surface>
    );
  }
}
Chart.propTypes = {
  outlook: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};
