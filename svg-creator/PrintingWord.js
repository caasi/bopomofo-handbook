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
    width: 410,
    height: 410,
    color: 'black'
  }

  render() {
    let { x, y, width, height, color } = this.props
    const { word } = this.props.data

    return (
      <svg
        width={width * word.length}
        height={height}
        viewBox={`0 0 ${2050 * word.length} 2050`}
        version={1.1}
      >
        <g x={x} y={y}>{
          map(
            (progress) =>
              <g key={progress} transform={`translate(${(progress - 1) * 2050})`}>{
                map(
                  (i) => <Stroke key={i} data={word[i]} color={color} />,
                  range(0, progress)
                )
              }</g>,
            range(1, word.length + 1)
          )
        }</g>
      </svg>
    )
  }
}



export default PrintingWord
