import { writable } from 'svelte/store'
import WheelConfig from '$lib/utils/WheelConfig'
import { defaultEntries, type Entry } from '$lib/utils/Wheel'

interface WheelStore {
  config: WheelConfig
  entries: Entry[]
}

const createWheelStore = (state: WheelStore) => {
  const { subscribe, update } = writable(state)

  const setConfig = (config: WheelConfig) => {
    update(state => {
      state.config = config
      return state
    })
  }

  const setEntries = (entries: Entry[]) => {
    update(state => {
      state.entries = entries
      return state
    })
  }

  const reset = () => {
    update(state => {
      state.config = new WheelConfig()
      state.entries = defaultEntries
      return state
    })
  }

  return { subscribe, setConfig, setEntries, reset }
}

const initialState: WheelStore = {
  config: new WheelConfig(),
  entries: defaultEntries
}

export const wheelStore = createWheelStore(initialState)
