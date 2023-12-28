import type { ConfettiType } from '$lib/utils/ConfettiLauncher'

export default class WheelConfig {
  title: string
  description: string
  colors: string[]
  spinTime: number
  displayWinnerDialog: boolean
  winnerMessage: string
  confetti: ConfettiType
  indefiniteSpin: boolean
  duringSpinSound: string
  duringSpinSoundVolume: number
  afterSpinSound: string
  afterSpinSoundVolume: number
  image: string

  constructor(props?: Partial<WheelConfig>) {
    this.title = props?.title ?? ''
    this.description = props?.description ?? ''
    this.colors = props?.colors ?? defaultColors
    this.spinTime = props?.spinTime ?? 10
    this.displayWinnerDialog = props?.displayWinnerDialog ?? true
    this.winnerMessage = props?.winnerMessage ?? ''
    this.confetti = props?.confetti ?? 'fireworks'
    this.indefiniteSpin = props?.indefiniteSpin ?? false
    this.duringSpinSound = props?.duringSpinSound ?? 'tick'
    this.duringSpinSoundVolume = props?.duringSpinSoundVolume ?? 0.5
    this.afterSpinSound = props?.afterSpinSound ?? 'SMALL_CROWD_APPLAUSE-Yannick_Lemieux-1268806408.mp3'
    this.afterSpinSoundVolume = props?.afterSpinSoundVolume ?? 0.5
    this.image = props?.image ?? ''
  }
}

export const defaultColors = ['#6693fa', '#eb6574', '#f5d273', '#6be88a']
