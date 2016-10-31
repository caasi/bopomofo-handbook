#!/usr/bin/env babel-node

import fs from 'fs-promise'
import path from 'path'
import punycode from 'punycode'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { map, compose, replace } from 'ramda'
import { computeLength } from 'react-zh-stroker/lib/data'
import PrintingWord from './PrintingWord'



const show = (...args) => console.log(...args) || args[0]

// toFilepath :: Int -> String
const toFilepath = (codepoint) =>
  path.resolve(__dirname, 'json', `${codepoint.toString(16)}.json`)

// readStroke :: String -> Promise Stroke
const readStroke = (filepath) =>
  fs.readFile(filepath, { encoding: 'utf8' })
    .then(JSON.parse)
    .then(computeLength)

// toSVG :: Stroke -> ReactInstance
const toSVG = (stroke) =>
  <PrintingWord width={410} height={410} data={stroke} />

// patchSVGString :: String -> String
const patchSVGString = replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')

// write :: Int -> String -> Promise ()
const write = (codepoint) => async (svgString) => {
  const filepath = path.resolve(__dirname, 'svg', `${codepoint.toString(16)}.svg`)
  await fs.writeFile(filepath, svgString, { encoding: 'utf8' })
  console.log(`${filepath} written`)
  return
}



// main :: ()
const main = () => {
  const [,, ...words] = process.argv
  const codes = punycode.ucs2.decode(words.join(''))

  map(
    (codepoint) => {
      compose(readStroke, toFilepath)(codepoint)
        .then(toSVG)
        .then(renderToStaticMarkup)
        .then(patchSVGString)
        .then(write(codepoint))
        .catch((e) => console.error(e))
    },
    codes
  )
}

main()
