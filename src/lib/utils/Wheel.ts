import WheelConfig from '$lib/utils/WheelConfig'
import { initialWheelState, type WheelState } from '$lib/utils/WheelState'

export default class Wheel {
  config: WheelConfig
  state: WheelState
  entries: Entry[]

  constructor(props?: Partial<Wheel>) {
    this.config = props?.config ?? new WheelConfig()
    this.state = props?.state ?? initialWheelState
    this.entries = props?.entries ?? defaultEntries
  }

  tick() {
    if (this.state.phase === 'demo') {
      let newAngle = this.state.angle + this.state.speed
      if (newAngle >= 360) newAngle -= 360
      this.state = {
        ...this.state,
        angle: newAngle
      }
    }
  }
}

export interface Entry {
  id: string
  text: string
}

export const getNewId = () => {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
}

export const defaultEntries: Entry[] = [
  { text: 'Ali' },
  { text: 'Beatriz' },
  { text: 'Charles' },
  { text: 'Diya' },
  { text: 'Eric' },
  { text: 'Fatima' },
  { text: 'Gabriel' },
  { text: 'Hanna' }
].map(entry => ({
  ...entry,
  id: getNewId()
}))
