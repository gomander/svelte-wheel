import type { ConfettiType } from '$lib/utils/ConfettiLauncher'

export default class WheelConfig {
  title: string
  description: string
  colors: string[]
  spinTime: number
  displayWinnerDialog: boolean
  winnerMessage: string
  confetti: ConfettiType

  constructor(props?: Partial<WheelConfig>) {
    this.title = props?.title ?? ''
    this.description = props?.description ?? ''
    this.colors = props?.colors ?? defaultColors
    this.spinTime = props?.spinTime ?? 10
    this.displayWinnerDialog = props?.displayWinnerDialog ?? true
    this.winnerMessage = props?.winnerMessage ?? ''
    this.confetti = props?.confetti ?? 'fireworks'
  }
}

export const defaultColors = ['#6693fa', '#eb6574', '#f5d273', '#6be88a']
