import { promises as fs } from 'fs'
import got from 'got'
import cheerio from 'cheerio'

const lists = {
  bestSellingPC: 'https://en.wikipedia.org/wiki/List_of_best-selling_PC_games',
  bestSellingXbox: 'https://en.wikipedia.org/wiki/List_of_best-selling_Xbox_video_games',
  bestSelling360: 'https://en.wikipedia.org/wiki/List_of_best-selling_Xbox_360_video_games',
  bestSellingNintendoNes:
    'https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_Entertainment_System_video_games',
  bestSellingNintendoSnes:
    'https://en.wikipedia.org/wiki/List_of_best-selling_Super_Nintendo_Entertainment_System_video_games',
  bestSellingNintendo64: 'https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_64_video_games',
  bestSellingNintendoGameBoy: 'https://en.wikipedia.org/wiki/List_of_best-selling_Game_Boy_video_games',
  bestSellingNintentoGameBoyAdvance: 'https://en.wikipedia.org/wiki/List_of_best-selling_Game_Boy_Advance_video_games',
  bestSellingNintendoGameCube: 'https://en.wikipedia.org/wiki/List_of_best-selling_GameCube_video_games',
  bestSellingNintendoWii: 'https://en.wikipedia.org/wiki/List_of_best-selling_Wii_video_games',
  bestSellingNintendoDS: 'https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_DS_video_games',
  bestSellingNintendo3DS: 'https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_3DS_video_games',
  bestSellingNinentdoSwitch: 'https://en.wikipedia.org/wiki/List_of_best-selling_Nintendo_Switch_video_games',
  bestSellingPS1: 'https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_video_games',
  bestSellingPS2: 'https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_2_video_games',
  bestSellingPS3: 'https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_3_video_games',
  bestSellingPS4: 'https://en.wikipedia.org/wiki/List_of_best-selling_PlayStation_4_video_games',
  highestGrossingArcade: 'https://en.wikipedia.org/wiki/Arcade_game#List_of_highest-grossing_games',
}

const colMaps: Record<keyof typeof lists, { name: number; releaseDate: number; genre?: number; listId?: string }> = {
  bestSellingPC: { name: 0, releaseDate: 3, genre: 4 },
  bestSellingXbox: { name: 0, releaseDate: 2, genre: 3 },
  bestSelling360: { name: 0, releaseDate: 2, genre: 3 },
  bestSellingNintendoNes: { name: 0, releaseDate: 3, genre: undefined },
  bestSellingNintendoSnes: { name: 0, releaseDate: 3, genre: undefined },
  bestSellingNintendo64: { name: 0, releaseDate: 3, genre: undefined },
  bestSellingNintendoGameBoy: { name: 0, releaseDate: 4, genre: undefined },
  bestSellingNintentoGameBoyAdvance: { name: 0, releaseDate: 3, genre: undefined },
  bestSellingNintendoGameCube: { name: 0, releaseDate: 2, genre: 3 },
  bestSellingNintendoWii: { name: 0, releaseDate: 2, genre: 3 },
  bestSellingNintendoDS: { name: 0, releaseDate: 2, genre: 3 },
  bestSellingNintendo3DS: { name: 0, releaseDate: 2, genre: 3 },
  bestSellingNinentdoSwitch: { name: 0, releaseDate: 3, genre: 4 },
  bestSellingPS1: { name: 0, releaseDate: 3, genre: undefined },
  bestSellingPS2: { name: 0, releaseDate: 2, genre: 3 },
  bestSellingPS3: { name: 0, releaseDate: 2, genre: 3 },
  bestSellingPS4: { name: 0, releaseDate: 2, genre: 3 },
  highestGrossingArcade: { name: 0, releaseDate: 1, genre: undefined, listId: '#Highest-grossing' },
}

const keyMeta: Record<keyof typeof lists, { platform: string; company: string }> = {
  bestSellingPC: { platform: 'PC', company: 'Various' },
  bestSellingXbox: { platform: 'Xbox', company: 'Microsoft' },
  bestSelling360: { platform: 'Xbox 360', company: 'Microsoft' },
  bestSellingNintendoNes: { platform: 'Nintento Entertainment System', company: 'Nintendo' },
  bestSellingNintendoSnes: { platform: 'Super Nintendo Entertainment System', company: 'Nintendo' },
  bestSellingNintendo64: { platform: 'Nintendo 64', company: 'Nintendo' },
  bestSellingNintendoGameBoy: { platform: 'Game Boy', company: 'Nintendo' },
  bestSellingNintentoGameBoyAdvance: { platform: 'Game Boy Advance', company: 'Nintendo' },
  bestSellingNintendoGameCube: { platform: 'Gamecube', company: 'Nintendo' },
  bestSellingNintendoWii: { platform: 'Wii', company: 'Nintendo' },
  bestSellingNintendoDS: { platform: 'Nintendo DS', company: 'Nintendo' },
  bestSellingNintendo3DS: { platform: 'Nintendo 3DS', company: 'Nintendo' },
  bestSellingNinentdoSwitch: { platform: 'Nintendo Switch', company: 'Nintendo' },
  bestSellingPS1: { platform: 'PlayStation 1', company: 'Sony' },
  bestSellingPS2: { platform: 'PlayStation 2', company: 'Sony' },
  bestSellingPS3: { platform: 'PlayStation 3', company: 'Sony' },
  bestSellingPS4: { platform: 'PlayStation 4', company: 'Sony' },
  highestGrossingArcade: { platform: 'Arcade', company: 'Various' },
}

;(async () => {
  console.info('start')
  const allData = await Promise.all(
    Object.keys(lists).map(async (key) => {
      const { body } = await got(lists[key])
      const mapping = colMaps[key]
      const $ = cheerio.load(body)
      let $table = $(mapping.listId || '#List')
        .parent()
        .next('table')
      if (!$table.first().attr('class')?.includes('sortable')) {
        $table = $table.next('table')
      }
      const data = $table
        .find('tbody > tr')
        .map((_, el) => {
          const row = ($(el)
            .find('td')
            .map((_2, td) => ({
              text: $(td).text().trim(),
              link: $(td).find('a').attr('href'),
            }))
            .toArray() as unknown) as { text: string; link?: string }[]
          if (row.length === 0) return
          const d = new Date(row[mapping.releaseDate].text)
          return {
            ...keyMeta[key],
            name: row[mapping.name].text.replace(/†$/, '').trim(),
            genre: mapping.genre ? row[mapping.genre].text : 'Unknown',
            releaseDate: {
              year: d.getFullYear(),
              month: d.getMonth(),
              day: d.getDate(),
            },
            type: 'game',
          }
        })
        .toArray()
        .filter(Boolean)
      return data
    })
  )
  const flatData = allData.flat(1)
  await fs.writeFile(__dirname + '/../data/games-raw.json', JSON.stringify(flatData, undefined, 2))
})()
