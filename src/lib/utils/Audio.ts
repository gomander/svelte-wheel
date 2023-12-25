let loopingAudio: HTMLAudioElement | null = null

export const playTick = (volume: number) => {
  playSound('Tick-DeepFrozenApps-397275646.mp3', volume)
}

export const playSound = (sound: string, volume: number) => {
  const audio = new Audio(`/audio/${sound}`)
  audio.volume = volume
  audio.oncanplaythrough = audio.play
}

export const playLoopedSound = (sound: string, volume: number) => {
  loopingAudio = new Audio(`/audio/${sound}`)
  loopingAudio.volume = volume
  loopingAudio.loop = true
  loopingAudio.oncanplaythrough = loopingAudio.play
}

export const cancelLoopingSounds = () => {
  if (!loopingAudio) return
  loopingAudio.pause()
  loopingAudio = null
}
