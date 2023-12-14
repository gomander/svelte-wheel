import { writable } from 'svelte/store'

const createFullscreenStore = (state: {
  active: boolean,
  element: HTMLElement | null
  supported: boolean
}) => {
  const { subscribe, update } = writable(state)

  const initialize = () => {
    update(state => {
      state.supported = document.fullscreenEnabled
      return state
    })
  }

  const updateFullscreen = () => {
    update(state => {
      state.active = !!document.fullscreenElement
      return state
    })
  }

  const enterFullscreen = async (element: HTMLElement) => {
    update(state => {
      element.addEventListener('fullscreenchange', updateFullscreen)
      element.requestFullscreen()
      state.active = true
      state.element = element
      return state
    })
  }

  const exitFullscreen = () => {
    update(state => {
      state.element?.removeEventListener('fullscreenchange', updateFullscreen)
      document.exitFullscreen()
      state.active = false
      state.element = null
      return state
    })
  }

  const toggleFullscreen = (element: HTMLElement = document.documentElement) => {
    if (state.active) return exitFullscreen()
    enterFullscreen(element)
  }

  return { subscribe, toggleFullscreen, initialize }
}

export const fullscreenStore = createFullscreenStore({
  active: false, element: null, supported: false
})
