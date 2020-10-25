import { promises as fs } from 'fs'
import getAudioName from './util/getAudioName'

const rawGames = require('../data/games-raw.json')

;(async () => {
  const result: any[] = await Promise.all(
    rawGames.map(async (i) => {
      try {
        const exists = await fs.stat(`${__dirname}/../public/audio/games/processed/${getAudioName(i.name)}.mp3`)
        return {
          ...i,
          audioLocation: `/audio/games/processed/${getAudioName(i.name)}.mp3`,
        }
      } catch {
        return i
      }
    })
  )
  const cleaned = result.filter((i) => i.audioLocation)
  await fs.writeFile(__dirname + '/../data/games.json', JSON.stringify(cleaned, undefined, 2))
})()
