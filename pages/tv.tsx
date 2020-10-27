import { useMemo } from 'react'
import { useRouter } from 'next/router'
import seedrandom from 'seedrandom'
import Game, { shuffle } from '../components/screens/Game'
import styles from './styles/tv.module.css'

const trackInfoRaw = require('../data/tv.json')

const seed = typeof window === 'undefined' ? undefined : new URLSearchParams(window.location.search).get('r')

const rnd = seedrandom(seed)

const trackInfo = shuffle(trackInfoRaw, rnd)

export default function TvPage() {
  const info = useRouter()
  const query = info.query as { [k: string]: string }
  const selectedGenres = (query.g || '').split(',').filter(Boolean)
  const selectedLogic = query.l || 'any'
  const selectedEras = (query.e || '').split(',').filter(Boolean)
  const filtered = useMemo(
    () =>
      trackInfo.filter((i) => {
        const operator = selectedLogic === 'all' ? 'every' : 'some'
        const matchesGenres =
          !selectedGenres.length || selectedGenres[operator]((v) => i.genres.some((g) => g.toLowerCase() === v))
        const matchesEras =
          selectedEras.length === 0 || selectedEras.length === 2
            ? true
            : i.years.start === null || selectedEras[0] === 'pre2000'
            ? i.years.start < 2000
            : i.years.start >= 2000
        return matchesGenres && matchesEras
      }),
    [selectedEras, selectedGenres, selectedLogic]
  )
  return (
    <>
      <Game trackInfo={filtered.length ? filtered : trackInfo} />
      {filtered.length === 0 ? (
        <div className={styles.warningBanner}>
          Your filters meant we had nothing to listen to, so we're listening to everything, sorry about that
        </div>
      ) : null}
    </>
  )
}
