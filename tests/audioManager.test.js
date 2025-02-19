import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import useAudioManager from '@/composables/audioManager'

globalThis.window = globalThis;

class FakeAudio {
  constructor(src) {
    this.src = src
    this.currentTime = 0
    this.eventListeners = {}
  }

  play() {
    if (this.src === 'fail') {
      return Promise.reject({ name: "NotSupportedError" })
    }
    return Promise.resolve()
  }

  pause() {

  }

  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }


  trigger(event) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(cb => cb())
    }
  }
}

describe('useAudioManager composable', () => {
  let originalAudio

  beforeEach(() => {

    originalAudio = window.Audio
    window.Audio = FakeAudio
  })

  afterEach(() => {
    // Restaura a implementação original do Audio
    window.Audio = originalAudio
  })

  it('deve reproduzir o áudio com sucesso', async () => {
    const { audio, isPlaying, currentSrc, play } = useAudioManager()
    const src = 'test.mp3'

    await play(src)

    expect(currentSrc.value).toBe(src)
    expect(isPlaying.value).toBe(true)
    expect(audio.value).toBeInstanceOf(FakeAudio)
    expect(audio.value.src).toBe(src)
  })

  it('deve pausar o áudio e atualizar isPlaying para false', async () => {
    const { isPlaying, play, pause } = useAudioManager()
    const src = 'test.mp3'

    await play(src)
    expect(isPlaying.value).toBe(true)

    pause()
    expect(isPlaying.value).toBe(false)
  })

  it('deve parar o áudio, zerar o currentTime e atualizar isPlaying para false', async () => {
    const { audio, isPlaying, play, stop } = useAudioManager()
    const src = 'test.mp3'

    await play(src)

    audio.value.currentTime = 10
    stop()

    expect(isPlaying.value).toBe(false)
    expect(audio.value.currentTime).toBe(0)
  })

  it('deve atualizar isPlaying para false quando o áudio termina (evento ended)', async () => {
    const { audio, isPlaying, play } = useAudioManager()
    const src = 'test.mp3'

    await play(src)
    expect(isPlaying.value).toBe(true)


    audio.value.trigger('ended')
    await nextTick()

    expect(isPlaying.value).toBe(false)
  })

  it('deve utilizar a fonte fallback quando a reprodução falhar com NotSupportedError', async () => {
    const { audio, isPlaying, currentSrc, play } = useAudioManager()
    const src = 'fail'
    const fallbackSrc = 'fallback.mp3'


    await play(src, fallbackSrc)

    expect(currentSrc.value).toBe(fallbackSrc)
    expect(isPlaying.value).toBe(true)
    expect(audio.value).toBeInstanceOf(FakeAudio)
    expect(audio.value.src).toBe(fallbackSrc)
  })

  it('deve rejeitar a promise se ambos os sources falharem', async () => {

    class AlwaysFailAudio extends FakeAudio {
      play() {
        return Promise.reject({ name: "NotSupportedError" })
      }
    }
    window.Audio = AlwaysFailAudio

    const { play } = useAudioManager()
    const src = 'fail'
    const fallbackSrc = 'fail'

    await expect(play(src, fallbackSrc)).rejects.toEqual({ name: "NotSupportedError" })
  })
})
