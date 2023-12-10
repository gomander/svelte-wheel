import WheelConfig from '$lib/utils/WheelConfig'
import {
  initialWheelState, click, tick, type WheelState
} from '$lib/utils/WheelState'

export default class Wheel {
  config: WheelConfig
  state: WheelState
  entries: Entry[]
  onStopped: (winner: Entry) => void

  constructor(props?: Partial<Wheel>) {
    this.config = props?.config ?? new WheelConfig()
    this.state = props?.state ?? initialWheelState
    this.entries = props?.entries ?? defaultEntries
    this.onStopped = props?.onStopped ?? (() => {})
  }

  click() {
    this.state = click(this.state)
  }

  tick() {
    const oldState = this.state
    const newState = tick(oldState, this.config.spinTime)
    if (newState.phase !== oldState.phase && newState.phase === 'stopped') {
      const entry = getEntryAtPointer(this)
      this.onStopped(entry)
    }
    this.state = newState
  }

  setConfig(config: WheelConfig) {
    this.config = config
  }

  setEntries(entries: Entry[]) {
    this.entries = entries
  }
}

export interface Entry {
  id: string
  text: string
}

const getIndexAtPointer = (wheel: Wheel) => (
  Math.round(
    wheel.state.angle / (2 * Math.PI / wheel.entries.length)
  ) % wheel.entries.length
)

const getEntryAtPointer = (wheel: Wheel) => (
  wheel.entries[getIndexAtPointer(wheel)]
)

export const getNewId = () => (
  crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
)

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
