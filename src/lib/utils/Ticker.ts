export default class Ticker {
  lastFrameTimeMs: number
  delta: number
  timestep: number

  constructor() {
    this.lastFrameTimeMs = 0
    this.delta = 0
    this.timestep = 1000 / 60
  }

  catchUp(ms: number, tick: () => void) {
    this.setTimestamp(ms)
    while (this.shouldTick()) tick()
  }

  setTimestamp(timestamp: number) {
    if (this.lastFrameTimeMs === 0) {
      this.delta = this.timestep;
    } else {
      this.delta += timestamp - this.lastFrameTimeMs;
    }
    this.lastFrameTimeMs = timestamp
  }

  shouldTick() {
    const retVal = this.delta >= this.timestep
    if (retVal) this.delta -= this.timestep
    return retVal
  }
}
