import { promises as fs } from 'fs'
import getAudioName from './getAudioName'
import { AudioType } from './types'

export default async function tidyData<T extends { name: string }>(
  data: T[],
  type: AudioType,
  formatName: (v: T) => string
) {
  const result: (T & { audioLocation?: string })[] = await Promise.all(
    data.map(async (i) => {
      try {
        const formattedName = getAudioName(formatName(i))
        await fs.stat(`${__dirname}/../public/audio/${type}/processed/${formattedName}.mp3`)
        return {
          ...i,
          audioLocation: `/audio/${type}/processed/${formattedName}.mp3`,
        }
      } catch {
        return i
      }
    })
  )
  const cleaned = result.filter((i) => i.audioLocation)
  await fs.writeFile(__dirname + `/../data/${type}.json`, JSON.stringify(cleaned, undefined, 2))
}
