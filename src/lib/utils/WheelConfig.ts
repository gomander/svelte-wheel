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
  hubSize: HubSize
  type: WheelType

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
    this.hubSize = props?.hubSize ?? 'S'
    this.type = props?.type ?? 'color'
  }
}

export const wheelTypes = ['color', 'image'] as const
export type WheelType = typeof wheelTypes[number]
export const hubSizeKeys = ['XXS', 'XS', 'S', 'M', 'L', 'XL'] as const
export type HubSize = typeof hubSizeKeys[number]
export const hubSizes: Record<HubSize, number> = {
  XXS: 0.05,
  XS: 0.1,
  S: 0.25,
  M: 0.33,
  L: 0.5,
  XL: 0.75
}
export const defaultColors = ['#6693fa', '#eb6574', '#f5d273', '#6be88a']
export const confettiTypes = ['fireworks', 'cannons', 'stars', 'off'] as const
export type ConfettiType = typeof confettiTypes[number]
