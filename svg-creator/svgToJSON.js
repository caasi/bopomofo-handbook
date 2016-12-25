#!/usr/bin/env babel-node

import fs from 'fs-promise'
import path from 'path'
import parse from 'svg-path-parser'
import { compose, identity, filter, map, reduce, split } from 'ramda'



const readSVG = (filepath) =>
  fs.readFile(filepath, { encoding: 'utf8' })

const transformRegExp = /matrix\((.*?)\)/
const getTransform = (svg) => {
  let r = transformRegExp.exec(svg)

  if (r) {
    let [scaleX,,,scaleY,offsetX,offsetY] = split(',', r[1])
    return {
      scaleX: +scaleX,
      scaleY: +scaleY,
      offsetX: +offsetX,
      offsetY: +offsetY,
    }
  }

  return {
    scaleX: 1.0,
    scaleY: 1.0,
    offsetX: 0,
    offsetY: 0,
  }
}

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
          x: path.x1,
          y: path.y2,
        },
        end: {
          x: path.x,
          y: path.y,
        },
      }
    case 'C':
      return {
        type: 'C',
        begin: {
          x: path.x1,
          y: path.y1,
        },
        mid: {
          x: path.x2,
          y: path.y2,
        },
        end: {
          x: path.x,
          y: path.y,
        },
      }
    default:
      return null
  }
}

const pathToTrack = (acc, path) => {
  return [...acc, { x: path.x, y: path.y }]
}

const toOutline = (trans, paths) => {
  let ret = compose(filter(identity), map(pathToStroke))(paths)
  ret = map(
    c => {
      let r = { type: c.type }
      if (c.x) {
        r.x = c.x * trans.scaleX + trans.offsetX
      }
      if (c.y) {
        r.y = c.y * trans.scaleY + trans.offsetY
      }
      if (c.begin) {
        r.begin = {}
        r.begin = {
          x: c.begin.x * trans.scaleX + trans.offsetX,
          y: c.begin.y * trans.scaleY + trans.offsetY,
        }
      }
      if (c.mid) {
        r.mid = {}
        r.mid = {
          x: c.mid.x * trans.scaleX + trans.offsetX,
          y: c.mid.y * trans.scaleY + trans.offsetY,
        }
      }
      if (c.end) {
        r.end = {}
        r.end = {
          x: c.end.x * trans.scaleX + trans.offsetX,
          y: c.end.y * trans.scaleY + trans.offsetY,
        }
      }
      return r
    },
    ret
  )
  return ret
}

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

      let trans = getTransform(svg)
      let [outline, ...track] = getPaths(svg)
      outline = toOutline(trans, parse(outline))
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
