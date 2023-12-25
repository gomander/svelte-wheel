let audio: HTMLAudioElement

if (typeof window !== 'undefined') {
  audio = new Audio()
}

export const playTick = (volume: number) => {
  playSound('/audio/Tick-DeepFrozenApps-397275646.mp3', volume)
}

export const playSound = (sound: string, volume: number) => {
  stopSound()
  audio.src = sound
  audio.volume = volume
  audio.oncanplaythrough = audio.play
}

export const playLoopedSound = (sound: string, volume: number) => {
  stopSound()
  audio.src = sound
  audio.volume = volume
  audio.loop = true
  audio.oncanplaythrough = audio.play
}

export const stopSound = () => {
  audio.pause()
  audio.currentTime = 0
  audio.loop = false
  audio.oncanplaythrough = null
}
