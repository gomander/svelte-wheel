const createBusyStore = (initialState: boolean) => {
  let spinning = $state(initialState)

  return {
    get spinning() {
      return spinning
    },
    set spinning(newValue: boolean) {
      spinning = newValue
    }
  }
}

export default createBusyStore(false)
