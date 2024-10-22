const createDebugStore = (initialState: boolean) => {
  let active = $state(initialState)

  const toggle = () => {
    active = !active
  }

  return {
    get active() {
      return active
    },
    set active(newValue: boolean) {
      active = newValue
    },
    toggle
  }
}

const debugStore = createDebugStore(false)

export default debugStore
