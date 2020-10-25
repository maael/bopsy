import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import seedrandom from 'seedrandom'
import { Howl, Howler } from 'howler'
import stringToColor from 'string-to-color'
import chroma from 'chroma-js'
import styles from './styles/index.module.css'

const trackInfoRaw = require('../data/games.json')

const seed = typeof window === 'undefined' ? undefined : new URLSearchParams(window.location.search).get('r')

const rnd = seedrandom(seed)

function shuffle(array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(rnd() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

const trackInfo = shuffle(trackInfoRaw)

export default function Index() {
  const startTime = useRef(+new Date())
  const countdown = useRef(25)
  const gameState = useRef({
    idx: 0,
    phase: 'guessing',
  })
  const [idxState, setIdxState] = useState(gameState.current.idx)
  const [volume, setVolume] = useState(0.1)
  const sound = useRef(
    new Howl({
      src: [trackInfo[gameState.current.idx].audioLocation],
      onplay: () => {
        startTime.current = +new Date()
        countdown.current = 25
      },
      onloaderror: () => {
        const nextIdx = gameState.current.idx + 1
        gameState.current = { phase: 'guessing', idx: trackInfo.length <= nextIdx ? 0 : nextIdx }
        sound.current.stop()
        setIdxState(gameState.current.idx)
      },
    })
  )

  useEffect(() => {
    Howler.volume(volume)
  }, [volume])

  useEffect(() => {
    sound.current = new Howl({
      src: [trackInfo[gameState.current.idx].audioLocation],
      onplay: () => {
        startTime.current = +new Date()
        countdown.current = 25
      },
      onloaderror: () => {
        const nextIdx = gameState.current.idx + 1
        gameState.current = { phase: 'guessing', idx: trackInfo.length <= nextIdx ? 0 : nextIdx }
        sound.current.stop()
        setIdxState(gameState.current.idx)
      },
    })
    sound.current.play()
    const revealTime = setTimeout(() => {
      gameState.current = { ...gameState.current, phase: 'reveal' }
      sound.current.fade(1, 0, 5000)
    }, 25000)
    const nextTime = setTimeout(() => {
      const nextIdx = gameState.current.idx + 1
      gameState.current = { phase: 'guessing', idx: trackInfo.length <= nextIdx ? 0 : nextIdx }
      sound.current.stop()
      setIdxState(gameState.current.idx)
    }, 30000)
    return () => {
      clearTimeout(revealTime)
      clearTimeout(nextTime)
    }
  }, [idxState])

  const analyser = useRef<AnalyserNode>()
  const requestRef = useRef<number>()
  const canvasRef = useRef<HTMLCanvasElement>()

  const animate = (time: number) => {
    if (analyser.current && canvasRef.current && sound.current.playing()) {
      const color = stringToColor(trackInfo[gameState.current.idx].name)
      const altColor = stringToColor(trackInfo[gameState.current.idx].name.split('').reverse().join(''))
      analyser.current.fftSize = 256
      const bufferLength = analyser.current.frequencyBinCount
      const colors = chroma
        .scale([color, altColor])
        .mode('lch')
        .colors(bufferLength)
        .map((i) => chroma(i).css())
      const dataArray = new Uint8Array(bufferLength)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      analyser.current.getByteFrequencyData(dataArray)

      const barWidth = (canvas.width / bufferLength) * 2.5
      const modifier = Math.floor(canvas.height / 256)
      let barHeight = 0
      let x = 0

      for (let i = 3; i < bufferLength; i++) {
        barHeight = dataArray[i]
        ctx.fillStyle = colors[i]
        ctx.fillRect(x, canvas.height - barHeight * modifier, barWidth, barHeight * modifier)
        x += barWidth + 1
      }
      ctx.font = `${Math.min(canvas.clientWidth / 5, canvas.clientHeight / 5)}px PressStart`
      ctx.fillStyle = colors[0]
      ctx.textAlign = 'center'
      countdown.current = Math.max(25 - Math.floor((+new Date() - startTime.current) / 1000), 0)
      ctx.fillText(
        `${gameState.current.phase === 'guessing' ? countdown.current : trackInfo[gameState.current.idx].name}`,
        canvas.clientWidth / 2,
        canvas.height / 2,
        canvas.clientWidth * 0.9
      )
    }
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvas.height = document.body.clientHeight
      canvas.width = document.body.clientWidth
    }
    sound.current.play()
    if (!sound.current.playing() && canvasRef.current) {
      const canvas = canvasRef.current
      const color = stringToColor(trackInfo[gameState.current.idx].name)
      const ctx = canvas.getContext('2d')!
      ctx.font = `${Math.min(canvas.clientWidth / 5, canvas.clientHeight / 5)}px PressStart`
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.fillText(`Click for sound`, canvas.clientWidth / 2, canvas.height / 2, canvas.clientWidth * 0.9)
    }
    return () => {
      sound.current.stop()
    }
  }, [])

  useEffect(() => {
    analyser.current = Howler.ctx.createAnalyser()
    Howler.masterGain.connect(analyser.current)
    analyser.current.connect(Howler.ctx.destination)
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const styleColor = stringToColor(trackInfo[idxState].name)

  return (
    <>
      <style jsx global>
        {`
          body {
            background-color: ${chroma(styleColor).darken(1.5).desaturate(1)};
          }
          input[type='range'] {
            -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
            background: transparent; /* Otherwise white in Chrome */
          }

          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
          }

          input[type='range']:focus {
            outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
          }
          input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none;
            border: 1px solid #000000;
            height: 36px;
            width: 16px;
            border-radius: 3px;
            background: #ffffff;
            cursor: pointer;
            margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
          }
          input[type='range']::-webkit-slider-runnable-track {
            width: 100%;
            height: 8.4px;
            cursor: pointer;
            box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
            background: ${styleColor};
            border-radius: 1.3px;
            border: 0.2px solid #010101;
          }

          input[type='range']:focus::-webkit-slider-runnable-track {
            background: ${styleColor};
          }
        `}
      </style>
      <canvas
        ref={(ref) => (canvasRef.current = ref!)}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -99, pointerEvents: 'none' }}
      />
      <Link href="/">
        <a>
          <h1 className={styles.title}>Bopsy</h1>
        </a>
      </Link>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '0.5em' }}>Volume</div>
        <input
          type="range"
          value={volume}
          step={0.01}
          min={0}
          max={1}
          onChange={(e) => setVolume(e.target.valueAsNumber)}
        />
      </div>
    </>
  )
}
