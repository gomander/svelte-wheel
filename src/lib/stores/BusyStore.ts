import { writable } from 'svelte/store'

const createBusyStore = (state: { spinning: boolean }) => {
  const { subscribe, update } = writable(state)

  const setSpinning = (spinning: boolean) => {
    update((state) => ({ ...state, spinning }))
  }

  return { subscribe, setSpinning }
}

const busyStore = createBusyStore({ spinning: false })

export default busyStore
