import seedrandom from 'seedrandom'
import Game, { shuffle } from '../components/screens/Game'

const trackInfoRaw = require('../data/movies.json')

const seed = typeof window === 'undefined' ? undefined : new URLSearchParams(window.location.search).get('r')

const rnd = seedrandom(seed)

const trackInfo = shuffle(trackInfoRaw, rnd)

export default function MoviePage() {
  return <Game trackInfo={trackInfo} />
}
