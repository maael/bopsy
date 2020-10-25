import { promises as fs } from 'fs'
import getAudioName from './util/getAudioName'

const rawMovies = require('../data/movies-raw.json')

;(async () => {
  const result: any[] = await Promise.all(
    rawMovies.map(async (i) => {
      try {
        const exists = await fs.stat(`${__dirname}/../public/audio/movies/processed/${getAudioName(i.name)}.mp3`)
        return {
          ...i,
          audioLocation: `/audio/movies/processed/${getAudioName(i.name)}.mp3`,
        }
      } catch {
        return i
      }
    })
  )
  const cleaned = result.filter((i) => i.audioLocation)
  await fs.writeFile(__dirname + '/../data/movies.json', JSON.stringify(cleaned, undefined, 2))
})()
