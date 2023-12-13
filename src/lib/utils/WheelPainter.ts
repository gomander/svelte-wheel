import FontPicker, { truncateText } from '$lib/utils/FontPicker'
import type Wheel from '$lib/utils/Wheel'

export type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

export default class WheelPainter {
  imageCache = new Map<string, HTMLCanvasElement | OffscreenCanvas>()
  fontPicker = new FontPicker()

  refresh() {
    const shadowImage = this.imageCache.get('shadow')
    const pointerImage = this.imageCache.get('pointer')
    this.imageCache.clear()
    if (shadowImage) this.imageCache.set('shadow', shadowImage)
    if (pointerImage) this.imageCache.set('pointer', pointerImage)
    this.fontPicker.clearFontCache()
  }

  draw(context: Context, wheel: Wheel) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    this.drawShadow(context)
    this.drawWheel(context, wheel)
    this.drawPointer(context)
  }

  drawShadow(context: Context) {
    if (!this.imageCache.has('shadow')) {
      this.drawShadowNoCache(createInMemoryImage(context))
    }
    context.drawImage(this.imageCache.get('shadow')!, 0, 0)
  }

  drawShadowNoCache(context: Context) {
    const { width, height } = context.canvas
    const x = width / 2
    const y = height / 2
    const radius = getWheelRadius(context)
    const gradient = context.createRadialGradient(
      x,
      y,
      radius,
      x,
      y + radius / 75,
      radius * 26 / 25
    )
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.25)')
    gradient.addColorStop(1, 'transparent')
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)
    this.imageCache.set('shadow', context.canvas)
  }

  drawWheel(context: Context, wheel: Wheel) {
    if (!this.imageCache.has('wheel')) {
      this.drawWheelNoCache(createInMemoryImage(context), wheel)
    }
    context.save()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.rotate(wheel.state.angle)
    context.translate(-context.canvas.width / 2, -context.canvas.height / 2)
    context.drawImage(this.imageCache.get('wheel')!, 0, 0)
    context.restore()
  }

  drawWheelNoCache(context: Context, wheel: Wheel) {
    this.drawSlices(context, wheel)
    this.drawCenter(context)
    this.imageCache.set('wheel', context.canvas)
  }

  drawSlices(context: Context, wheel: Wheel) {
    if (!this.imageCache.has('slices')) {
      this.drawSlicesNoCache(createInMemoryImage(context), wheel)
    }
    context.drawImage(this.imageCache.get('slices')!, 0, 0)
  }

  drawSlicesNoCache(context: Context, wheel: Wheel) {
    context.save()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const radius = getWheelRadius(context)
    context.font = this.fontPicker.getFont(
      context,
      wheel.entries.map(entry => entry.text),
      radius,
      radius / 3,
      2 * Math.PI / wheel.entries.length
    )
    wheel.entries.forEach((_entry, index) => {
      this.drawSlice(context, wheel, index)
      context.rotate(-2 * Math.PI / wheel.entries.length)
    })
    context.restore()
    this.imageCache.set('slices', context.canvas)
  }

  drawSlice(context: Context, wheel: Wheel, index: number) {
    const radius = getWheelRadius(context)
    const radians = 2 * Math.PI / wheel.entries.length
    const bgColor = wheel.config.colors[index % wheel.config.colors.length]
    this.drawSliceBg(context, radius, radians, bgColor)
    this.drawText(context, wheel.entries[index].text, radius, 'black')
  }

  drawSliceBg(
    context: Context,
    radius: number,
    radians: number,
    color: string
  ) {
    context.beginPath()
    context.moveTo(0, 0)
    context.arc(0, 0, radius, -radians / 2, radians / 2)
    context.lineTo(0, 0)
    context.fillStyle = color
    context.fill()
  }

  drawText(
    context: Context,
    text: string,
    radius: number,
    color: string
  ) {
    context.lineJoin = 'round'
    context.textBaseline = 'middle'
    context.textAlign = 'end'
    context.fillStyle = color
    context.fillText(truncateText(text), radius * 15 / 16, 0)
  }

  drawCenter(context: Context) {
    if (!this.imageCache.has('center')) {
      this.drawCenterNoCache(createInMemoryImage(context))
    }
    context.drawImage(this.imageCache.get('center')!, 0, 0)
  }

  drawCenterNoCache(context: Context) {
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.beginPath()
    context.arc(0, 0, getWheelRadius(context) / 5, 0, 2 * Math.PI)
    context.fillStyle = 'white'
    context.fill()
    this.imageCache.set('center', context.canvas)
  }

  drawPointer(context: Context) {
    if (!this.imageCache.has('pointer')) {
      this.drawPointerNoCache(createInMemoryImage(context))
    }
    context.drawImage(this.imageCache.get('pointer')!, 0, 0)
  }

  drawPointerNoCache(context: Context) {
    context.save()
    const { width, height } = context.canvas
    context.shadowColor = 'black'
    context.shadowOffsetY = 4
    context.shadowBlur = 10
    context.fillStyle = 'white'
    context.strokeStyle = 'black'
    context.moveTo(width * 19 / 20, height * 19 / 40)
    context.beginPath()
    context.lineTo(width * 19 / 20, height * 21 / 40)
    context.lineTo(width * 9 / 10, height / 2)
    context.lineTo(width * 19 / 20, height * 19 / 40)
    context.fill()
    context.stroke()
    context.restore()
    this.imageCache.set('pointer', context.canvas)
  }
}

const getWheelRadius = (context: Context) => Math.min(
  context.canvas.width, context.canvas.height
) / 2 * 0.85

const createInMemoryImage = (context: Context) => new OffscreenCanvas(
  context.canvas.width, context.canvas.height
).getContext('2d')!
