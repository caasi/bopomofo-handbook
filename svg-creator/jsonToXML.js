#!/usr/bin/env babel-node

import fs from 'fs-promise'
import path from 'path'
import { map } from 'ramda'



const rnd = x => Math.round(x * 100) / 100

const main = async () => {
  const [,, ...args] = process.argv

  const ps = map(
    async (cp) => {
      const json = await fs.readJSON(path.resolve(__dirname, 'json', `${cp}.json`))

      const x = []
      x.push('<?xml version="1.0" encoding="UTF-8"?>')
      x.push(`<Word version="1.0" unicode="${String.fromCodePoint(parseInt(cp, 16))}">`)

      for (const stroke of json) {
        x.push('  <Stroke>')

        x.push('    <Outline>')
        for (const outline of stroke.outline) {
          switch (outline.type) {
            case 'M':
              x.push(`      <MoveTo x="${rnd(outline.x)}" y="${rnd(outline.y)}" />`)
              break;
            case 'L':
              x.push(`      <LineTo flexible="false" x="${rnd(outline.x)}" y="${rnd(outline.y)}" />`)
              break;
            case 'C':
              x.push(`      <CubicTo flexible="false" x1="${rnd(outline.begin.x)}" y1="${rnd(outline.begin.y)}" x2="${rnd(outline.mid.x)}" y2="${rnd(outline.mid.y)}" x3="${rnd(outline.end.x)}" y3="${rnd(outline.end.y)}" />`)
              break;
            case 'Q':
              x.push(`      <QuadTo flexible="false" x1="${rnd(outline.begin.x)}" y1="${rnd(outline.begin.y)}" x2="${rnd(outline.end.x)}" y2="${rnd(outline.end.y)}" />`)
              break;
            default:
          }
        }
        x.push('    </Outline>')

        x.push('    <Track>')
        for (const track of stroke.track) {
          x.push(`      <MoveTo x="${rnd(track.x)}" y="${rnd(track.y)}" />`)
        }
        x.push('    </Track>')

        x.push('  </Stroke>')
      }

      x.push('</Word>')

      const xml = x.join('\n')
      const filepath = path.resolve(__dirname, 'xml', `${cp}.xml`)
      await fs.outputFile(filepath, xml, { encoding: 'utf8' })
      console.log(`${filepath} written`)
    },
    args
  )

  return Promise.all(ps)
}

main()
  .catch((e) => console.error(e))
