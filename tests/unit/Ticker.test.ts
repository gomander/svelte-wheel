import { describe, beforeEach, it, expect, vi } from 'vitest'
import Ticker, { FPS } from '$lib/utils/Ticker'

describe('Ticker', () => {
  let ticker: Ticker

  beforeEach(() => {
    ticker = new Ticker()
  })

  it('should set the initial values', () => {
    expect(ticker.lastFrameTimeMs).toBe(0)
    expect(ticker.delta).toBe(0)
    expect(ticker.timestep).toBe(1000 / FPS)
  })

  it('should catch up', () => {
    const wheel = {
      tick() { }
    }
    const tickSpy = vi.spyOn(wheel, 'tick')
    ticker.setTimestamp(ticker.timestep)
    ticker.catchUp(ticker.timestep * 10, wheel.tick)
    expect(tickSpy).toHaveBeenCalledTimes(10)
  })
})
