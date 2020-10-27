import fs from 'fs'
import ytdl from 'ytdl-core'
import throat from 'throat'
import search from './ytSearch'
import getAudioName from './getAudioName'
import { AudioType } from './types'

const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', error ? (error as any).message : 'An error')
})

export async function getAudioForData<T = any>(
  data: T[],
  type: AudioType,
  searchStrAppend: string,
  formatName: (v: T) => string
) {
  try {
    await Promise.all(data.map(throat(10, async (v) => getAudio(type, formatName(v), searchStrAppend))))
  } catch (e) {
    console.error('[error]', e.messsage)
  }
}

async function getAudio(type: AudioType, searchStr: string, searchStrAppend: string) {
  try {
    const audioName = getAudioName(searchStr)
    const result = await search(`${searchStr} ${searchStrAppend}`)
    const selected = result[0]
    await downloadAudio(type, selected.id, audioName)
    await wait(5000)
    return audioName
  } catch (e) {
    console.error('[error]', searchStr, e.message)
  }
}

async function downloadAudio(type: AudioType, id: string, audioName: string) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${id}`
    const stream = ytdl(url, { quality: 'highestaudio' }).pipe(
      fs.createWriteStream(__dirname + `/../public/audio/${type}/raw/${audioName}.mp3`)
    )
    stream.on('close', resolve)
    stream.on('error', reject)
    stream.on('finish', resolve)
  })
}
