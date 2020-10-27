import { useState } from 'react'
import classnames from 'classnames'
import { tvGenresList } from '../../scripts/util/data'
import styles from './TvGameBuilder.module.css'
import Link from 'next/link'

export default function TvGameBuilder() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLogic, setSelectedLogic] = useState<'any' | 'all'>('any')

  const [selectedEra, setSelectedEra] = useState<('pre2000' | 'post2000')[]>(['pre2000', 'post2000'])
  const s = new Set(selectedGenres)
  return (
    <div className={styles.center}>
      <div className={styles.text}>Or make your own TV series custom game, click on any genres you want included</div>
      <div className={styles.genreContainer}>
        {tvGenresList.map((g) => {
          return (
            <div
              key={g}
              className={classnames(styles.genreItem, s.has(g) && styles.genreItemActive)}
              onClick={() => {
                if (!s.has(g)) {
                  setSelectedGenres(selectedGenres.concat(g))
                } else {
                  setSelectedGenres(selectedGenres.filter((i) => i !== g))
                }
              }}
            >
              {g}
            </div>
          )
        })}
      </div>
      <div className={styles.text}>Do you want things with any of the genres, or all of them?</div>
      <div className={styles.genreContainer}>
        <div
          className={classnames(styles.genreItem, selectedLogic === 'any' && styles.genreItemActive)}
          onClick={() => setSelectedLogic('any')}
        >
          Any
        </div>
        <div
          className={classnames(styles.genreItem, selectedLogic === 'all' && styles.genreItemActive)}
          onClick={() => setSelectedLogic('all')}
        >
          All
        </div>
      </div>
      <div className={styles.text}>What era do you want things with in, select any you want</div>
      <div className={styles.genreContainer}>
        <div
          className={classnames(styles.genreItem, selectedEra.includes('pre2000') && styles.genreItemActive)}
          onClick={() => {
            if (selectedEra.includes('pre2000')) {
              setSelectedEra(selectedEra.filter((i) => i !== 'pre2000'))
            } else {
              setSelectedEra(selectedEra.concat('pre2000'))
            }
          }}
        >
          Before 2000
        </div>
        <div
          className={classnames(styles.genreItem, selectedEra.includes('post2000') && styles.genreItemActive)}
          onClick={() => {
            if (selectedEra.includes('post2000')) {
              setSelectedEra(selectedEra.filter((i) => i !== 'post2000'))
            } else {
              setSelectedEra(selectedEra.concat('post2000'))
            }
          }}
        >
          After 2000
        </div>
      </div>
      <Link href={`/tv?g=${selectedGenres.join(',')}&l=${selectedLogic}&e=${selectedEra.join(',')}`}>
        <a className={styles.link}>To Custom Game</a>
      </Link>
    </div>
  )
}
