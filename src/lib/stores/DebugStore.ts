import { writable } from 'svelte/store'

const createDebugStore = (state: { active: boolean }) => {
  const { subscribe, update } = writable(state)

  const setActive = (active: boolean) => {
    update(state => ({ ...state, active }))
  }

  const toggle = () => {
    update(state => ({ ...state, active: !state.active }))
  }

  return { subscribe, setActive, toggle }
}

const debugStore = createDebugStore({ active: false })

export default debugStore
