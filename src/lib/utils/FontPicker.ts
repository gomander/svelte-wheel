import type { Context } from '$lib/utils/WheelPainter'

/**
 * Gets the largest font size that will fit on the wheel for all the given texts
 * @param context 2D canvas context
 * @param texts Array of texts to fit on the wheel
 * @param wheelRadius Outer radius of the wheel
 * @param hubRadius Inner radius of the wheel
 * @param smallestAngle Angle of the smallest slice on the wheel
 * @returns CSS font string
 */
export const getFont = (
  context: Context,
  texts: string[],
  wheelRadius: number,
  hubRadius: number,
  smallestAngle: number
) => {
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
  return `500 ${minFontSize}px ${fontName}`
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
  if (!text) return true
  context.font = font
  const width = context.measureText(text).width
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
  // This was taken from StackOverflow. I cannot explain it, but it works.
  return (
    (
      radius ** 2 -
      (height / 2) ** 2
    ) ** (1 / 2) -
    Math.max(
      height * Math.cos(angle) / (2 * Math.sin(angle)),
      innerRadius
    )
  ) >= width
}
