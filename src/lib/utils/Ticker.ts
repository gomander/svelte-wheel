import { FPS } from '$lib/utils/WheelState'

export default class Ticker {
  lastFrameTimeMs = 0
  delta = 0
  timestep = 1000 / FPS

  catchUp(ms: number, tick: () => void) {
    this.setTimestamp(ms)
    while (this.shouldTick()) {
      tick()
    }
  }

  setTimestamp(timestamp: number) {
    if (this.lastFrameTimeMs === 0) {
      this.delta = this.timestep
    } else {
      this.delta += timestamp - this.lastFrameTimeMs
    }
    this.lastFrameTimeMs = timestamp
  }

  shouldTick() {
    const shouldTick = this.delta >= this.timestep
    if (shouldTick) {
      this.delta -= this.timestep
    }
    return shouldTick
  }
}
