import { createCanvas } from '@napi-rs/canvas'
import WheelPainter from '$lib/server/WheelPainter'
import type Wheel from '$lib/utils/Wheel'

export const createThumbnail = async (wheel: Wheel) => {
  const wheelPainter = new WheelPainter()
  const canvas = createCanvas(400, 400)
  const context = canvas.getContext('2d')
  await wheelPainter.draw(context, wheel)
  return canvas.toBuffer('image/png')
}
