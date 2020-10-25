import fs from 'fs'
import ytdl from 'ytdl-core'
import throat from 'throat'
import search from './util/ytSearch'
import getAudioName from './util/getAudioName'

const moviesRaw = require('../data/movies-raw.json')

;(async () => {
  await Promise.all(moviesRaw.map(throat(10, async (v) => getGameAudio(v.name))))
})()

async function getGameAudio(game: string) {
  const audioName = getAudioName(game)
  try {
    const result = await search(`${game} movie theme`)
    const selected = result[0]
    await downloadAudio(selected.id, audioName)
    return audioName
  } catch (e) {
    console.error('[error]', game, e.message)
  }
}

async function downloadAudio(id: string, audioName: string) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${id}`
    const stream = ytdl(url, { quality: 'highestaudio' }).pipe(
      fs.createWriteStream(__dirname + `/../public/audio/movies/raw/${audioName}.mp3`)
    )
    stream.on('close', resolve)
    stream.on('error', reject)
    stream.on('finish', resolve)
  })
}
