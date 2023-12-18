export default class WheelConfig {
  title: string
  description: string
  colors: string[]
  spinTime: number
  displayWinnerDialog: boolean
  winnerMessage: string

  constructor(props?: Partial<WheelConfig>) {
    this.title = props?.title ?? ''
    this.description = props?.description ?? ''
    this.colors = props?.colors ?? defaultColors
    this.spinTime = props?.spinTime ?? 10
    this.displayWinnerDialog = props?.displayWinnerDialog ?? true
    this.winnerMessage = props?.winnerMessage ?? 'We have a winner!'
  }
}

export const defaultColors = ['#6693fa', '#eb6574', '#f5d273', '#6be88a']
