import { v4 as uuid } from 'uuid'
import WheelConfig from '$lib/utils/WheelConfig'
import {
  initialWheelState, click, tick, type WheelState
} from '$lib/utils/WheelState'

export default class Wheel {
  config: WheelConfig
  state: WheelState
  entries: Entry[]
  onStarted?: () => void
  onPointerIndexChanged?: (index: number) => void
  onStopped?: (winner: Entry, color: string) => void

  constructor(props?: Partial<Wheel>) {
    this.config = props?.config ?? new WheelConfig()
    this.state = props?.state ?? initialWheelState
    this.entries = props?.entries ?? defaultEntries
    this.onStarted = props?.onStarted
    this.onPointerIndexChanged = props?.onPointerIndexChanged
    this.onStopped = props?.onStopped
  }

  click() {
    const oldState = this.state
    const newState = click(this.state)
    if (
      this.onStarted &&
      newState.phase !== oldState.phase &&
      newState.phase === 'accelerating'
    ) {
      this.onStarted()
    }
    this.state = newState
  }

  tick() {
    const oldState = this.state
    const newState = tick(
      oldState, this.config.spinTime, this.config.indefiniteSpin
    )
    if (this.onPointerIndexChanged) {
      const oldIndex = getIndexAtPointer({
        config: this.config, entries: this.entries, state: oldState
      })
      const newIndex = getIndexAtPointer({
        config: this.config, entries: this.entries, state: newState
      })
      if (newIndex !== oldIndex) {
        this.onPointerIndexChanged(getIndexAtPointer(this))
      }
    }
    if (
      this.onStopped &&
      newState.phase !== oldState.phase &&
      newState.phase === 'stopped'
    ) {
      const entry = getEntryAtPointer(this)
      this.onStopped(entry, getColorAtPointer(this))
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

const getIndexAtPointer = (
  wheel: Pick<Wheel, 'config' | 'entries' | 'state'>
) => (
  Math.round(
    wheel.state.angle / (2 * Math.PI / wheel.entries.length)
  ) % wheel.entries.length
)

const getEntryAtPointer = (
  wheel: Pick<Wheel, 'config' | 'entries' | 'state'>
) => (
  wheel.entries[getIndexAtPointer(wheel)]
)

const getColorAtPointer = (
  wheel: Pick<Wheel, 'config' | 'entries' | 'state'>
) => (
  wheel.config.colors[getIndexAtPointer(wheel) % wheel.config.colors.length]
)

export const getNewId = () => uuid().split('-')[0]

export const defaultEntries: Entry[] = [
  'Ali', 'Beatriz', 'Charles', 'Diya', 'Eric', 'Fatima', 'Gabriel', 'Hanna'
].map(text => ({ text, id: getNewId() }))
