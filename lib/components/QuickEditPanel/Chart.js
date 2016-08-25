import React, {PropTypes, Component} from 'react';
import {ART, View} from 'react-native';
var {
  Surface,
  Shape,
} = ART;

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {style, outlook, height, width} = this.props;

    var pathPreFI = "";
    var pathPostFI = "";

    const strokeWidth = height / (outlook.annualBalances.length + 1);
    const retirementPortfolio = outlook.retirementPortfolio;

    outlook.annualBalances.forEach(function(balance, index) {
      const y = 2 + index * (strokeWidth + 1);
      const path = "M 0," + y + " " + ((balance / retirementPortfolio * 200) || 0) + "," + y + " ";
      if(balance > retirementPortfolio) {
        pathPostFI += path;
      } else {
        pathPreFI += path;
      }
    });

    return (
      <Surface width={width || 300} height={height || 300}>
        <Shape d={pathPreFI} stroke="#0000FF" strokeWidth={strokeWidth} />
        <Shape d={pathPostFI} stroke="#00FF00" strokeWidth={strokeWidth} />
      </Surface>
    );
  }
}
Chart.propTypes = {
  outlook: PropTypes.object.isRequired
}
