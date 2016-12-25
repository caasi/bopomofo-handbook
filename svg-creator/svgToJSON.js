#!/usr/bin/env babel-node

import fs from 'fs-promise'
import path from 'path'
import parse from 'svg-path-parser'
import { compose, identity, filter, map, reduce } from 'ramda'



const readSVG = (filepath) =>
  fs.readFile(filepath, { encoding: 'utf8' })

const pathRegExp = /<path\sd="(.*?)"/g
const getPaths = (svg) => {
  let ret = []
  let r
  while(r = pathRegExp.exec(svg)) {
    ret.push(r[1])
  }
  return ret
}

const pathToStroke = (path) => {
  switch(path.code) {
    case 'M':
      return {
        type: 'M',
        x: path.x,
        y: path.y,
      }
    case 'L':
      return {
        type: 'L',
        x: path.x,
        y: path.y,
      }
    case 'Q':
      return {
        type: 'Q',
        begin: {
          x: path.x,
          y: path.y,
        },
        end: {
          x: path.x1,
          y: path.y1,
        },
      }
    case 'C':
      return {
        type: 'C',
        begin: {
          x: path.x,
          y: path.y,
        },
        mid: {
          x: path.x1,
          y: path.y1,
        },
        end: {
          x: path.x2,
          y: path.y2,
        },
      }
    default:
      return null
  }
}

const pathToTrack = (acc, path) => {
  return [...acc, { x: path.x, y: path.y }]
}

const toOutline = compose(filter(identity), map(pathToStroke))

const toTrack = (paths) =>
  paths.length
    ? reduce(
        (acc, path) => [...acc, { x: path[1].x, y: path[1].y }],
        [{ x: paths[0][0].x, y: paths[0][0].y }],
        paths
      )
    : []

const main = async () => {
  const [,, ...args] = process.argv

  const ps = map(
    async (cp) => {
      const svg = await readSVG(path.resolve(__dirname, 'svg', cp, '1.svg'))

      let [outline, ...track] = getPaths(svg)
      outline = toOutline(parse(outline))
      track = toTrack(map(parse, track))

      const word = [{ outline, track }]
      const filepath = path.resolve(__dirname, 'json', `${cp}.json`)
      await fs.outputFile(filepath, JSON.stringify(word, null, 2), { encoding: 'utf8' })
      console.log(`${filepath} written`)
    },
    args
  )

  return Promise.all(ps)
}

main()
  .catch((e) => console.error(e))
