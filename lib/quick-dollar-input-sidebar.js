/*
* onSelect: function(newValue){}
todo:
* - swipe right to dismiss?
* - allow keyboard as alternate input?
*/

import React, { PropTypes, Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  LayoutAnimation,
  StyleSheet
} from 'react-native';
import PureComponent from './pureComponent';
import Icon from 'react-native-vector-icons/Entypo';
import formatMoneyCompact from './formatMoney';
import PureRenderMixin from 'react-addons-pure-render-mixin';

let sidebarInput;

let simpleDollarAmounts = [];
for(var i=0; i<50; ++i) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=50; i<150; i+=5) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=150; i<300; i+=10) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=300; i<1000; i+=25) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=1000; i<2000; i+=50) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=2000; i<10000; i+=100) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=10000; i<50000; i+=500) {
  simpleDollarAmounts.push(i*1000);
}
for(var i=50000; i<=100000; i+=1000) {
  simpleDollarAmounts.push(i*1000);
}

class InputRow extends View {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <TouchableHighlight underlayColor='grey'
        style={this.props.selected ? styles.inputRowSelected : styles.inputRow}
        onPress={()=>{this.props.onSelect(this.props.amount)}}>
        <Text style={styles.inputRowText}>
          {formatMoneyCompact(this.props.amount)}
        </Text>
      </TouchableHighlight>
    );
  }
}
InputRow.propTypes = {
  onSelect: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  selected: PropTypes.bool
}

class QuickDollarInputSidebar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rowsDisplayed: 71,
      visible: false,
      value: undefined,
      onHide: undefined,
      onChange: undefined
    };
    this._scrollview = undefined;
    this._componentValueYCoordinates = {};
    sidebarInput = this;
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  show(selectedValue, onChange, onHide) {
    if(this.state.onHide) {
      this.state.onHide();
    }

    if(this.props.onVisibilityChange) {
      this.props.onVisibilityChange(true);
    }

    let y = 44 * simpleDollarAmounts.indexOf(selectedValue);
    requestAnimationFrame(()=>
      this._scrollview.scrollTo({y})
    );

    this.setState({
      value: selectedValue,
      visible: true,
      onChange: onChange,
      onHide: onHide
    });
  }
  render() {
    return (
      <View
        style={this.state.visible ? styles.topViewVisible : styles.topViewHidden}>
        <ScrollView style={styles.scrollView} ref={(ctl)=>this._scrollview = ctl}>

          {simpleDollarAmounts.slice(0, this.state.rowsDisplayed).map((amount)=>
            <InputRow amount={amount} selected={amount===this.state.value}
              onSelect={(num)=>this.onSelect(num)} key={amount}
              onLayout={(event) => {
                this._componentValueYCoordinates[amount] = event.nativeEvent.layout.y;
              }}
              />
          )}
          <TouchableHighlight style={styles.inputRow}
            onPress={()=>this.setState({rowsDisplayed: this.state.rowsDisplayed + 50})}>
            <Icon name="dots-three-horizontal" size={30} color="white"/>
          </TouchableHighlight>

        </ScrollView>

        <TouchableHighlight onPress={()=>this.hide()} style={styles.dismissIconContainer}>
          <Icon name="arrow-with-circle-right" size={30} color="black"/>
        </TouchableHighlight>
      </View>
    );
  }
  hide() {
    this.setState({visible: false});
    if(this.props.onVisibilityChange) {
      this.props.onVisibilityChange(false);
    }
    if(this.state.onHide) {
      this.state.onHide();
    }
  }
  onSelect(num) {
    this.setState({value: num});
    this.state.onChange(num);
  }
}
QuickDollarInputSidebar.propTypes = {
  onVisibilityChange: PropTypes.func
}

class SidebarInputTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: false};
  }
  onPress() {
    if(this.state.selected) {
      return;
    }
    this.setState({selected: true});
    sidebarInput.show(
      this.props.value,
      this.props.onChange,
      ()=>this.setState({selected: false}));
  }
  render() {
    return (
      <TouchableHighlight onPress={()=>this.onPress()}>
        {this.props.renderChildren(this.state.selected)}
      </TouchableHighlight>
    );
  }
}
SidebarInputTrigger.propTypes = {
  value: PropTypes.number,
  renderChildren: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

export {QuickDollarInputSidebar, SidebarInputTrigger};

let styles = StyleSheet.create({
  topViewVisible: {
    width: 75,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  topViewHidden: {
    width: 0,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  scrollView: {
    backgroundColor: 'orange',
    flexDirection: 'column'
  },
  dismissIconContainer: {
    height: 44,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  inputRow: {
    backgroundColor: 'transparent',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputRowSelected: {
    backgroundColor: 'green',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputRowText: {color: 'white'}
});
