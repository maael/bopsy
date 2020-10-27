import { promises as fs } from 'fs'
import getAudioName from './util/getAudioName'

const raw = require('../data/tv-raw.json')

;(async () => {
  const result: any[] = await Promise.all(
    raw.map(async (i) => {
      try {
        const exists = await fs.stat(
          `${__dirname}/../public/audio/tv/processed/${getAudioName(`${i.name} - ${i.years.start}`)}.mp3`
        )
        return {
          ...i,
          audioLocation: `/audio/tv/processed/${getAudioName(`${i.name} - ${i.years.start}`)}.mp3`,
        }
      } catch {
        return i
      }
    })
  )
  const cleaned = result.filter((i) => i.audioLocation)
  await fs.writeFile(__dirname + '/../data/tv.json', JSON.stringify(cleaned, undefined, 2))
})()
