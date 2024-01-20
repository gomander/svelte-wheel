import { describe, beforeEach, it, expect } from 'vitest'
import { createCanvas, GlobalFonts, type SKRSContext2D } from '@napi-rs/canvas'
import FontPicker, { truncateText, getTextColor } from '$lib/utils/FontPicker'

GlobalFonts.registerFromPath('static/Quicksand.ttf', 'Quicksand')

describe('FontPicker', () => {
  let fontPicker: FontPicker
  let context: SKRSContext2D

  beforeEach(() => {
    fontPicker = new FontPicker()
    context = createCanvas(100, 100).getContext('2d')
  })

  it('should set the initial values', () => {
    expect(fontPicker.resultCache).toBeInstanceOf(Map)
  })

  it('should get the font', () => {
    const texts = ['foo', 'bar']
    const wheelRadius = 100
    const hubRadius = 10
    const smallestAngle = Math.PI
    const font = fontPicker.getFont(
      context, texts, wheelRadius, hubRadius, smallestAngle
    )
    expect(font).toBe('500 56px Quicksand')
  })

  it('should get the cached result', () => {
    const texts = ['foo', 'bar']
    const wheelRadius = 100
    const hubRadius = 10
    const smallestAngle = Math.PI
    const font = fontPicker.getFont(
      context, texts, wheelRadius, hubRadius, smallestAngle
    )
    expect(fontPicker.getCachedResult(
      texts, wheelRadius, hubRadius, smallestAngle
    )).toBe(font)
  })

  it('truncates text that is too long', () => {
    expect(truncateText('12345678901234567')).toBe('12345678901234567')
    expect(truncateText('1234567890123456789')).toBe('12345678901234567…')
  })

  it('gets the text color', () => {
    expect(getTextColor('#000000')).toBe('#FFFFFF')
    expect(getTextColor('#FF0000')).toBe('#000000')
    expect(getTextColor('#00FF00')).toBe('#000000')
    expect(getTextColor('#0000FF')).toBe('#FFFFFF')
    expect(getTextColor('#FFFF00')).toBe('#000000')
    expect(getTextColor('#FF00FF')).toBe('#000000')
    expect(getTextColor('#00FFFF')).toBe('#000000')
    expect(getTextColor('#FFFFFF')).toBe('#000000')
    expect(getTextColor('#121212')).toBe('#FFFFFF')
    expect(getTextColor('#DEDEDE')).toBe('#000000')
  })
})
