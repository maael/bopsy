import { promises as fs } from 'fs'
import got from 'got'
import cheerio from 'cheerio'

const getGenreUrl = (genre: string, start: number) =>
  `https://www.imdb.com/search/title/?explore=title_type,genres&title_type=tvSeries&genres=${genre}&start=${start}`

const genresList = [
  'comedy',
  'drama',
  'family',
  'adventure',
  'romance',
  'action',
  'sci-fi',
  'horror',
  'crime',
  'mystery',
  'thriller',
  'documentary',
  'musical',
  'animation',
]

;(async () => {
  console.info('[start:tv]')
  const twoPageGenres = genresList
    .map((g) => [
      { genre: g, start: 0 },
      { genre: g, start: 51 },
    ])
    .flat(1)
  const allData = (
    await Promise.all(
      twoPageGenres.map(async (g) => {
        const { body } = await got(getGenreUrl(g.genre, g.start))
        const $ = cheerio.load(body)
        return $('.lister-item-content')
          .map((_, cn) => {
            const name = $(cn).find('.lister-item-header a').text().trim()
            const years = $(cn).find('.lister-item-header .lister-item-year').text().trim()
            const [yearStart, yearEnd] = years.split('–').map((i) => i.replace(/^\(/, '').replace(/\)$/, '').trim())
            const genres = $(cn)
              .find('.genre')
              .text()
              .split(', ')
              .map((t) => t.replace(/\n/g, '').trim())
            return {
              name,
              years: {
                start: yearStart ? Number(yearStart) : null,
                end: yearEnd ? Number(yearEnd) : null,
              },
              genres,
            }
          })
          .toArray()
      })
    )
  ).flat(1)
  await fs.writeFile(__dirname + '/../data/tv-raw.json', JSON.stringify(allData, undefined, 2))
  console.info(`[finish:tv] Got ${allData.length} tv series`)
})()
