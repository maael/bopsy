import fs from 'fs'
import ytdl from 'ytdl-core'
import throat from 'throat'
import search from './util/ytSearch'
import getAudioName from './util/getAudioName'

const raw = require('../data/tv-raw.json')

const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', error ? (error as any).message : 'An error')
})
;(async () => {
  await Promise.all(raw.map(throat(10, async (v) => getAudio(`${v.name} - ${v.years.start}`))))
})().catch((err) => console.error(err))

async function getAudio(searchStr: string) {
  try {
    const audioName = getAudioName(searchStr)
    const result = await search(`${searchStr} ost main theme`)
    const selected = result[0]
    await downloadAudio(selected.id, audioName)
    await wait(5000)
    return audioName
  } catch (e) {
    console.error('[error]', searchStr, e.message)
  }
}

async function downloadAudio(id: string, audioName: string) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${id}`
    const stream = ytdl(url, { quality: 'highestaudio' }).pipe(
      fs.createWriteStream(__dirname + `/../public/audio/tv/raw/${audioName}.mp3`)
    )
    stream.on('close', resolve)
    stream.on('error', reject)
    stream.on('finish', resolve)
  })
}
