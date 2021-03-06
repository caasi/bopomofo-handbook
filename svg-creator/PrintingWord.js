import React, { Component } from 'react'
import Stroke from 'react-zh-stroker/lib/Stroke'
import { map, range } from 'ramda'



class PrintingWord extends Component {
  static defaultProps = {
    data: {
      word: [],
      length: 0
    },
    x: 0,
    y: 0,
    width: 2048,
    height: 2048,
    color: 'black',
    progress: 0
  }

  render() {
    let { x, y, width, height, progress, color } = this.props
    const { word } = this.props.data

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 2048 2048`}
        version={1.1}
      >
        <g x={x} y={y}>{
          map(
            (i) => <Stroke key={i} data={word[i]} color={color} trackSize={400}/>,
            range(0, progress)
          )
        }</g>
      </svg>
    )
  }
}



export default PrintingWord
