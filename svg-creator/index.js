#!/usr/bin/env babel-node

import fs from 'fs-promise'
import path from 'path'
import punycode from 'punycode'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { map, compose, replace, range } from 'ramda'
import computeLength from 'react-zh-stroker/lib/data/computeLength'
import PrintingWord from './PrintingWord'



// readStroke :: String -> Promise Stroke
const readStroke = (filepath) =>
  fs.readFile(filepath, { encoding: 'utf8' })
    .then(JSON.parse)
    .then(computeLength)



// main :: () => Promise ()
const main = () => {
  const [,, ...words] = process.argv
  const codes = punycode.ucs2.decode(words.join(''))

  const ps = map(
    async (codepoint) => {
      const filepath =
        path.resolve(__dirname, 'json', `${codepoint.toString(16)}.json`)
      const stroke = await readStroke(filepath)
      const ps = map(
        async (index) => {
          const comp = <PrintingWord data={stroke} progress={index} />
          const markup = renderToStaticMarkup(comp)
          const result =
            replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ', markup)
          const filepath =
            path.resolve(__dirname, 'svg', codepoint.toString(16), `${index}.svg`)
          await fs.outputFile(filepath, result, { encoding: 'utf8' })
          console.log(`${filepath} written`)
          return
        },
        range(1, stroke.word.length + 1)
      )

      return Promise.all(ps)
    },
    codes
  )

  return Promise.all(ps)
}

main()
  .catch((e) => console.error(e))
