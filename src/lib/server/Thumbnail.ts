import { createCanvas } from '@napi-rs/canvas'
import WheelPainter from '$lib/server/WheelPainter'
import type Wheel from '$lib/utils/Wheel'

export const createThumbnail = async (
  wheel: Wheel, size: number, background?: string
) => {
  const wheelPainter = new WheelPainter()
  const canvas = createCanvas(size, size)
  const context = canvas.getContext('2d')
  await wheelPainter.draw(context, wheel, background)
  return canvas.encode('webp')
}
