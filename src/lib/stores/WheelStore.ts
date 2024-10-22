import { persistedState } from '$lib/stores/PersistedState.svelte'
import WheelConfig from '$lib/utils/WheelConfig'
import { defaultEntries, getNewEntryId, type Entry } from '$lib/utils/Wheel'

interface WheelStoreData {
  config: WheelConfig
  entries: Entry[]
  winners: Entry[]
  path: string | null
}

const createWheelStore = (state: WheelStoreData) => {
  const store = persistedState('wheel', state)

  const setConfig = (config: WheelConfig) => {
    store.update(state => {
      state.config = config
      return state
    })
  }

  const setEntries = (entries: Entry[]) => {
    store.update(state => {
      state.entries = entries
      return state
    })
  }

  const setNewEntries = (entries: Omit<Entry, 'id'>[]) => {
    store.update(state => {
      state.entries = entries.map(entry => ({ ...entry, id: getNewEntryId() }))
      return state
    })
  }

  const setWinners = (winners: Entry[]) => {
    store.update(state => {
      state.winners = winners
      return state
    })
  }

  const setPath = (path: string | null) => {
    store.update(state => {
      state.path = path
      return state
    })
  }

  return {
    get value() {
      return store.value
    },
    set value(newValue: WheelStoreData) {
      store.value = newValue
    },
    reset: store.reset,
    setConfig,
    setEntries,
    setNewEntries,
    setWinners,
    setPath
  }
}

const initialState: WheelStoreData = {
  config: new WheelConfig(),
  entries: defaultEntries,
  winners: [],
  path: null
}

export default createWheelStore(initialState)
