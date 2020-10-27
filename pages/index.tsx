import Link from 'next/link'
import TvGameBuilder from '../components/primitives/TvGameBuilder'
import styles from '../components/screens/Game.module.css'

export default function Index() {
  return (
    <div>
      <Link href="/">
        <a>
          <h1 className={styles.title}>Bopsy</h1>
        </a>
      </Link>
      <p style={{ color: 'var(--color-secondary)', textAlign: 'center' }}>A game of guess the thing from the bop</p>
      <p style={{ textAlign: 'center' }}>
        <Link href="/game">
          <a style={{ color: 'var(--color-tertiary)' }}>To All Video Games</a>
        </Link>
      </p>
      <p style={{ textAlign: 'center' }}>
        <Link href="/movies">
          <a style={{ color: 'var(--color-tertiary)' }}>To All Movies</a>
        </Link>
      </p>
      <p style={{ textAlign: 'center' }}>
        <Link href="/tv">
          <a style={{ color: 'var(--color-tertiary)' }}>To All TV</a>
        </Link>
      </p>
      <TvGameBuilder />
    </div>
  )
}
