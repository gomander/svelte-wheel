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
  onStopped?: (data: OnStoppedData) => void

  constructor(props?: Partial<Wheel>) {
    this.config = props?.config ?? new WheelConfig()
    this.state = props?.state ?? initialWheelState
    this.entries = props?.entries ?? defaultEntries
    this.onStarted = props?.onStarted
    this.onPointerIndexChanged = props?.onPointerIndexChanged
    this.onStopped = props?.onStopped
  }

  click() {
    if (!this.entries.length) return
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
        entries: this.entries, state: oldState
      })
      const newIndex = getIndexAtPointer({
        entries: this.entries, state: newState
      })
      if (newIndex !== oldIndex) {
        this.onPointerIndexChanged(newIndex)
      }
    }
    if (
      this.onStopped &&
      newState.phase !== oldState.phase &&
      newState.phase === 'stopped'
    ) {
      this.onStopped({
        winner: getEntryAtPointer(this), color: getColorAtPointer(this)
      })
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

export interface OnStoppedData {
  winner: Entry
  color: string | null
}

const getIndexAtPointer = (wheel: Pick<Wheel, 'entries' | 'state'>) => {
  return Math.round(
    wheel.state.angle / (2 * Math.PI / (wheel.entries.length || 1))
  ) % (wheel.entries.length || 1)
}

const getEntryAtPointer = (wheel: Pick<Wheel, 'entries' | 'state'>) => {
  return wheel.entries[getIndexAtPointer(wheel)]
}

const getColorAtPointer = (
  wheel: Pick<Wheel, 'config' | 'entries' | 'state'>
) => {
  if (wheel.config.type === 'image' || !wheel.config.colors.length) return null
  return wheel.config.colors[
    getIndexAtPointer(wheel) % wheel.config.colors.length
  ]
}

export const addIdsToEntries = (entries: Omit<Entry, 'id'>[]) => {
  return entries.map(entry => ({ ...entry, id: getNewEntryId() }))
}

export const getNewEntryId = () => crypto.randomUUID().split('-')[0]

export const defaultEntries: Entry[] = [
  'Ali', 'Beatriz', 'Charles', 'Diya', 'Eric', 'Fatima', 'Gabriel', 'Hanna'
].map(text => ({ text, id: getNewEntryId() }))
