import React, {PropTypes} from 'react';
// = require('ReactNativeART');
import {ART} from 'react-native';
var {
  Surface,
  Shape,
} = ART;

export default function Chart({outlook}) {

  var pathPreFI = "";
  var pathPostFI = "";

  const strokeWidth = 300 / (outlook.annualBalances.length + 1);
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

  pathPreFI += " Z";
  pathPostFI += " Z";

  return (
    <Surface width={280} height={300}>
      <Shape d={pathPreFI} stroke="#0000FF" strokeWidth={strokeWidth} />
      <Shape d={pathPostFI} stroke="#00FF00" strokeWidth={strokeWidth} />
    </Surface>
  );
}
Chart.propTypes = {
  outlook: PropTypes.object.isRequired
}
