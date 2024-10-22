const createFullscreenStore = (initialState: {
  active: boolean,
  element: HTMLElement | null
  supported: boolean
}) => {
  let state = $state(initialState)

  const initialize = () => {
    state.supported = document.fullscreenEnabled
  }

  const updateFullscreen = () => {
    state.active = !!document.fullscreenElement
  }

  const enterFullscreen = async (element: HTMLElement) => {
    element.addEventListener('fullscreenchange', updateFullscreen)
    element.requestFullscreen()
    state.active = true
    state.element = element
  }

  const exitFullscreen = () => {
    state.element?.removeEventListener('fullscreenchange', updateFullscreen)
    document.exitFullscreen()
    state.active = false
    state.element = null
  }

  const toggleFullscreen = (element: HTMLElement = document.documentElement) => {
    if (state.active) return exitFullscreen()
    enterFullscreen(element)
  }

  return {
    get active() {
      return state.active
    },
    get supported() {
      return state.supported
    },
    toggleFullscreen,
    initialize
  }
}

const fullscreenStore = createFullscreenStore({
  active: false, element: null, supported: false
})

export default fullscreenStore
