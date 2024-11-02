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

  const setNewEntries = (entries: Omit<Entry, 'id'>[]) => {
    store.update(state => {
      state.entries = entries.map(entry => ({ ...entry, id: getNewEntryId() }))
      return state
    })
  }

  return {
    get config() {
      return store.value.config
    },
    set config(newValue: WheelConfig) {
      store.value.config = newValue
    },
    get entries() {
      return store.value.entries
    },
    set entries(newValue: Entry[]) {
      store.value.entries = newValue
    },
    get winners() {
      return store.value.winners
    },
    set winners(newValue: Entry[]) {
      store.value.winners = newValue
    },
    get path() {
      return store.value.path
    },
    set path(newValue: string | null) {
      store.value.path = newValue
    },
    reset: store.reset,
    setNewEntries
  }
}

const initialState: WheelStoreData = {
  config: new WheelConfig(),
  entries: defaultEntries,
  winners: [],
  path: null
}

export default createWheelStore(initialState)
