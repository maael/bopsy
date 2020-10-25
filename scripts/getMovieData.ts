import { promises as fs } from 'fs'
import got from 'got'
import cheerio from 'cheerio'

const lists = [
  {
    url: 'https://en.wikipedia.org/wiki/List_of_highest-grossing_animated_films_of_the_1990s',
    listId: '#Highest-grossing_animated_films_of_the_1990s',
  },
  {
    url: 'https://en.wikipedia.org/wiki/List_of_highest-grossing_animated_films_of_the_2000s',
    listId: '#Highest-grossing_animated_films_of_the_2000s',
  },
  {
    url: 'https://en.wikipedia.org/wiki/List_of_highest-grossing_animated_films_of_the_2010s',
    listId: '#Highest-grossing_animated_films_of_the_2010s',
  },
]

;(async () => {
  const allData = await Promise.all(
    lists.map(async (l) => {
      const { body } = await got(l.url)
      const $ = cheerio.load(body)
      const $table = $(l.listId).parent().next().next()
      const data = $table
        .find('tbody > tr')
        .map((i, el) => {
          const row = ($(el)
            .children()
            .map((_2, td) => ({
              text: $(td).text().trim(),
              link: $(td).find('a').attr('href'),
            }))
            .toArray() as unknown) as { text: string; link?: string }[]
          console.info(row)
          if (row.length < 3 || i < 2) return
          return {
            name: row[1].text,
            year: row[6].text,
          }
        })
        .toArray()
        .filter(Boolean)
      return data
    })
  )
  const flatData = allData.flat(1)
  await fs.writeFile(__dirname + '/../data/movies-raw.json', JSON.stringify(flatData, undefined, 2))
})()
