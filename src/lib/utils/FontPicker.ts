import type { SKRSContext2D } from '@napi-rs/canvas'

type Context = CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D
  | SKRSContext2D

export default class FontPicker {
  resultCache = new Map<string, string>()

  /**
   * Gets the largest font size that will fit on the wheel for all the given texts
   * @param context 2D canvas context
   * @param texts Array of texts to fit on the wheel
   * @param wheelRadius Outer radius of the wheel
   * @param hubRadius Inner radius of the wheel
   * @param smallestAngle Angle of the smallest slice on the wheel
   * @returns CSS font string
   */
  getFont(
    context: Context,
    texts: string[],
    wheelRadius: number,
    hubRadius: number,
    smallestAngle: number
  ) {
    const cachedResult = this.getCachedResult(
      texts, wheelRadius, hubRadius, smallestAngle
    )
    if (cachedResult) return cachedResult
    let minFontSize = 200
    const fontName = 'Quicksand'
    texts.forEach(text => {
      const fontSize = getFontSize(
        context, text, fontName, wheelRadius, hubRadius, smallestAngle
      )
      if (fontSize < minFontSize) {
        minFontSize = fontSize
      }
    })
    const font = `500 ${minFontSize}px ${fontName}`
    this.cacheResult(texts, wheelRadius, hubRadius, smallestAngle, font)
    return font
  }

  getCachedResult(
    texts: string[],
    wheelRadius: number,
    hubRadius: number,
    smallestAngle: number
  ) {
    return this.resultCache.get(
      getCacheKey(texts, wheelRadius, hubRadius, smallestAngle)
    )
  }

  cacheResult(
    texts: string[],
    wheelRadius: number,
    hubRadius: number,
    smallestAngle: number,
    font: string
  ) {
    this.resultCache.set(
      getCacheKey(texts, wheelRadius, hubRadius, smallestAngle), font
    )
  }

  clearFontCache() {
    this.resultCache.clear()
  }
}

/**
 * Runs a bisect search with a default minimum and maximum font size
 * @param context 2D canvas context
 * @param displayText Text to be displayed
 * @param fontName Font name
 * @param wheelRadius Outer radius of the wheel
 * @param hubRadius Inner radius of the wheel
 * @param smallestAngle Angle of the smallest slice on the wheel
 * @returns The ideal font size
 */
const getFontSize = (
  context: Context,
  displayText: string,
  fontName: string,
  wheelRadius: number,
  hubRadius: number,
  smallestAngle: number
) => {
  return bisectSearch(
    context,
    wheelRadius,
    hubRadius,
    smallestAngle,
    fontName,
    displayText,
    3,
    200
  )
}

/**
 * Finds the largest possible font size using a bisect search
 * @param context 2D canvas context
 * @param wheelRadius Outer radius of the wheel
 * @param hubRadius Inner radius of the wheel
 * @param smallestAngle Angle of the smallest slice on the wheel
 * @param fontName Font name
 * @param text Text to be displayed
 * @param min Minimum font size
 * @param max Maximum font size
 * @returns Ideal font size
 */
const bisectSearch = (
  context: Context,
  wheelRadius: number,
  hubRadius: number,
  smallestAngle: number,
  fontName: string,
  text: string,
  min: number,
  max: number
) => {
  let fontSize: number
  do {
    fontSize = Math.round((min + max) / 2)
    if (
      textFits(
        context,
        wheelRadius,
        hubRadius,
        smallestAngle / 2,
        text,
        `500 ${fontSize}px ${fontName}`,
        fontSize
      )
    ) {
      min = fontSize
    } else {
      max = fontSize
    }
  } while (Math.abs(max - min) >= 2)
  return fontSize
}

/**
 * Determines if a text fits within a slice of the wheel
 * @param context 2D canvas context
 * @param radius Outer radius of the wheel
 * @param innerRadius Inner radius of the wheel
 * @param angle Angle of the slice
 * @param text Text to be displayed
 * @param font CSS font string
 * @param height Height of the text
 * @returns Whether or not the text fits
 */
const textFits = (
  context: Context,
  radius: number,
  innerRadius: number,
  angle: number,
  text: string,
  font: string,
  height: number
) => {
  if (!text) {
    return true
  }
  context.font = font
  const { width } = context.measureText(truncateText(text))
  return boxFits(angle, radius, innerRadius, width, height)
}

/**
 * Determines if a box fits within a slice of the wheel
 * @param angle Angle of the slice
 * @param radius Outer radius of the wheel
 * @param innerRadius Inner radius of the wheel
 * @param width Width of the box
 * @param height Height of the box
 * @returns Whether or not the box fits
 */
const boxFits = (
  angle: number,
  radius: number,
  innerRadius: number,
  width: number,
  height: number
) => {
  return (
    (radius ** 2 - (height / 2) ** 2) ** 0.5 - Math.max(
      height * Math.cos(angle) / (2 * Math.sin(angle)), innerRadius
    )
  ) >= width
}

const getCacheKey = (
  texts: string[],
  wheelRadius: number,
  hubRadius: number,
  smallestAngle: number
) => {
  return JSON.stringify({ texts, wheelRadius, hubRadius, smallestAngle })
}

/**
 * Truncates a text to a maximum length of 18 characters
 * @param text Text to be truncated
 * @returns Truncated text
 */
export const truncateText = (text: string) => {
  if (text.length <= 18) {
    return text
  }
  return text.substring(0, 17) + '…'
}

/**
 * Chooses either black or white text based on the background color
 * @param bgColor Hex color string
 * @returns Black or white hex color string
 */
export const getTextColor = (bgColor: string) => {
  const luminance = getColorLuminance(bgColor)
  const whiteContrastRatio = 1.05 / (luminance + 0.05)
  const blackContrastRatio = (luminance + 0.05) / 0.05
  if (whiteContrastRatio > blackContrastRatio) {
    return '#FFFFFF'
  }
  return '#000000'
}

const hexToRatio = (hex: string) => {
  return Number(`0x${hex}`) / 255
}

const getColorLuminance = (color: string) => {
  color = color.replace('#', '')
  const sRgbColors = [
    hexToRatio(color.substring(0, 2)),
    hexToRatio(color.substring(2, 4)),
    hexToRatio(color.substring(4, 6))
  ]
  const c = sRgbColors.map(color => {
    if (color <= 0.03928) {
      return color / 12.92
    }
    return ((color + 0.055) / 1.055) ** 2.4
  })
  return (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2])
}
