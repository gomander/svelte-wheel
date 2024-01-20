import { describe, beforeEach, it, expect, vi } from 'vitest'
import Ticker from '$lib/utils/Ticker'
import { FPS } from '$lib/utils/WheelState'

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

  it('should set the timestamp', () => {
    ticker.setTimestamp(1000)
    expect(ticker.lastFrameTimeMs).toBe(1000)
    expect(ticker.delta).toBe(ticker.timestep)
    ticker.setTimestamp(2000)
    expect(ticker.lastFrameTimeMs).toBe(2000)
    expect(ticker.delta).toBe(ticker.timestep + 1000)
  })

  it('should know when to tick', () => {
    expect(ticker.shouldTick()).toBe(false)
    ticker.setTimestamp(1000)
    expect(ticker.shouldTick()).toBe(true)
    ticker.catchUp(1000, () => {})
    expect(ticker.shouldTick()).toBe(false)
  })

  it('should catch up', () => {
    const wheel = {
      tick() {}
    }
    const tickSpy = vi.spyOn(wheel, 'tick')
    ticker.catchUp(1, wheel.tick)
    ticker.catchUp(ticker.timestep * 10, wheel.tick)
    expect(tickSpy).toHaveBeenCalledTimes(10)
  })
})
