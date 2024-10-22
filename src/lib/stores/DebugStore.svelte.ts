const createDebugStore = (state: boolean) => {
  let active = $state(state)

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
