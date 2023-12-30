import { get, writable } from 'svelte/store'
import { localStorageStore } from '@skeletonlabs/skeleton'
import WheelConfig from '$lib/utils/WheelConfig'
import { defaultEntries, type Entry } from '$lib/utils/Wheel'

interface WheelStoreData {
  config: WheelConfig
  entries: Entry[]
  winners: Entry[]
}

const createWheelStore = (state: WheelStoreData) => {
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

  const setWinners = (winners: Entry[]) => {
    update(state => {
      state.winners = winners
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

  return { subscribe, setConfig, setEntries, setWinners, reset }
}

const initialState: WheelStoreData = {
  config: new WheelConfig(),
  entries: defaultEntries,
  winners: []
}

const localStorageWheelStore = localStorageStore('wheel', initialState)

const wheelStore = createWheelStore(get(localStorageWheelStore))

wheelStore.subscribe(localStorageWheelStore.set)

export default wheelStore
