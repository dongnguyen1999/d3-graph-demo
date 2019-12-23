import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Svg,Circle,Line,G } from 'react-native-svg'
import * as d3 from 'd3-force'

var nodes = [
  {id: '1'},
  {id: '2'},
  {id: '3'}
]
var links = [
  {source: '1', target: '2'},
  {source: '2', target: '3'},
  {source: '3', target: '1'}
]

var width = 300;
var height = 600;

export default class App extends Component {
  _isMounted = false;
  
  constructor(props){
    super(props);
    this.counter = 0;
    this.state = {
      nodes: nodes,
      links: links
    }
  }
  ticked(){
    // console.log(this._isMount);
    if (this._isMounted) {
      this.forceUpdate();
    }
  }

  componentDidMount(){
    // console.log("Thư thư");
    this._isMounted = true;
    this.simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink().id(function(d) { return d.id; }).links(links).distance(150))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", () => {this.ticked()});
  
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  drawLink() {
    let linkViews = [];
    this.state.links.forEach((link) => {
      if (link.source.id != undefined){
        linkViews.push(<Line 
          key={link.source.id + ":" + link.target.id}
          x1={link.source.x} 
          y1={link.source.y} 
          x2={link.target.x}
          y2={link.target.y}
          stroke='#000000'
          strokeWidth={2}/>)
      }
    })
    return linkViews;
  }

  drawNode() {
    // console.log("Drawing node at " + nodes[0].x + ":" + nodes[0].y);
    let nodeViews = [];
    this.state.nodes.forEach((node) => {
      nodeViews.push(<Circle 
        onMoveShouldSetResponder={() => {console.log("onMoveShouldSetResponder")}}
        onResponderGrant={() => this.dragStartedListener(node.index)}
        onResponderMove={(event) => this.draggedListener(node.index, event)}
        onPress={() => {console.log('press')}}
        onResponderRelease = {() => this.dragEndedListener(node.index)}
        cx={node.x} 
        cy={node.y}
        r={20}
        key={node.id}
        fill='#2E9AFE'
        strokeWidth={3}
        stroke='#B40404'
        position='relative'
      ></Circle>)
    })
    return nodeViews;
  }

  dragStartedListener(index) {
    this.simulation.alphaTarget(0.3).restart();
    this.state.nodes[index].fx = this.state.nodes[index].x;
    this.state.nodes[index].fy = this.state.nodes[index].y;
  }
  
  draggedListener(index, event) {
    this.state.nodes[index].fx = event.nativeEvent.locationX;
    this.state.nodes[index].fy = event.nativeEvent.locationY;
  }
  
  dragEndedListener(index) {
    this.simulation.alphaTarget(0);
    this.state.nodes[index].fx = null;
    this.state.nodes[index].fy = null;
  }


  render(){
    // console.log(nodes);
    // console.log(this.state);
    return (
      <View style={styles.container}>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <Svg width={300} height={600}>
          <G>
            {this.drawLink()}
            {this.drawNode()}
          </G>
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
