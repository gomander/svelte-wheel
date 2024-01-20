import { describe, beforeEach, it, expect, vi } from 'vitest'
import Wheel, { defaultEntries, type Entry } from '$lib/utils/Wheel'
import WheelConfig from '$lib/utils/WheelConfig'
import { initialWheelState, FPS } from '$lib/utils/WheelState'

describe('Wheel', () => {
  let wheel: Wheel

  beforeEach(() => {
    wheel = new Wheel()
  })

  it('should set the default config', () => {
    expect(wheel.config).toEqual(new WheelConfig())
  })

  it('should set the default entries', () => {
    expect(wheel.entries).toBe(defaultEntries)
  })

  it('should set the default state', () => {
    expect(wheel.state).toBe(initialWheelState)
  })

  it('should set the config', () => {
    const title = 'Test title'
    const description = 'Test description'
    const colors = ['#ffffff', '#000000']
    const spinTime = 5
    const displayWinnerDialog = false
    const winnerMessage = 'Test winner message'
    const config = new WheelConfig({
      title, description, colors, spinTime, displayWinnerDialog, winnerMessage
    })
    wheel.setConfig(config)
    expect(wheel.config.title).toBe(title)
    expect(wheel.config.description).toBe(description)
    expect(wheel.config.colors).toBe(colors)
    expect(wheel.config.spinTime).toBe(spinTime)
    expect(wheel.config.displayWinnerDialog).toBe(displayWinnerDialog)
    expect(wheel.config.winnerMessage).toBe(winnerMessage)
  })

  it('should set the entries', () => {
    const entries: Entry[] = [
      { text: 'Test entry 1', id: 'test-entry-1' },
      { text: 'Test entry 2', id: 'test-entry-2' },
      { text: 'Test entry 3', id: 'test-entry-3' },
      { text: 'Test entry 4', id: 'test-entry-4' }
    ]
    wheel.setEntries(entries)
    expect(wheel.entries).toBe(entries)
  })

  it('should start spinning when clicked', () => {
    expect(wheel.state.phase).toBe('demo')
    wheel.click()
    expect(wheel.state.phase).toBe('accelerating')
  })

  it('should decelerate after accelerating for 1 second', () => {
    wheel.click()
    expect(wheel.state.phase).toBe('accelerating')
    for (let i = 0; i <= FPS; i++) {
      wheel.tick()
    }
    expect(wheel.state.phase).toBe('decelerating')
  })

  it('should set the angle after accelerating for 1 second', () => {
    wheel.click()
    expect(wheel.state.angle).toBe(0)
    for (let i = 0; i < FPS; i++) {
      wheel.tick()
    }
    const nextAngle = wheel.state.angle + wheel.state.speed
    wheel.tick()
    expect(wheel.state.angle).toBeGreaterThanOrEqual(0)
    expect(wheel.state.angle).toBeLessThan(2 * Math.PI)
    expect(wheel.state.angle).not.toBe(nextAngle)
    expect(wheel.state.angle).not.toBe(2 * Math.PI - nextAngle)
  })

  it('should stop spinning after 10 seconds', () => {
    wheel.click()
    for (let i = 0; i <= FPS * wheel.config.spinTime; i++) {
      wheel.tick()
    }
    expect(wheel.state.phase).toBe('stopped')
  })

  it('should call onStopped when the wheel stops spinning', () => {
    const onStoppedSpy = vi.spyOn(wheel, 'onStopped')
    wheel.click()
    for (let i = 0; i <= FPS * wheel.config.spinTime; i++) {
      wheel.tick()
    }
    expect(onStoppedSpy).toHaveBeenCalled()
  })

  it('should spin again when clicked after stopping', () => {
    wheel.click()
    for (let i = 0; i <= FPS * wheel.config.spinTime; i++) {
      wheel.tick()
    }
    wheel.click()
    expect(wheel.state.phase).toBe('accelerating')
  })
})
