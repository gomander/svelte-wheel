import {
  createCanvas, loadImage, type Canvas, type SKRSContext2D as Context
} from '@napi-rs/canvas'
import FontPicker, { truncateText, getTextColor } from '$lib/utils/FontPicker'
import { hubSizes } from '$lib/utils/WheelConfig'
import type Wheel from '$lib/utils/Wheel'

export default class WheelPainter {
  imageCache = new Map<string, Canvas | null>()
  fontPicker = new FontPicker()

  async draw(context: Context, wheel: Wheel, background?: string) {
    if (background) {
      context.fillStyle = background
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    }
    this.drawShadow(context)
    await this.drawBackground(context, wheel)
    this.drawWheel(context, wheel)
    await this.drawCenterImage(context, wheel)
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
      x, y, radius,
      x, y + radius / 75, radius * 26 / 25
    )
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.25)')
    gradient.addColorStop(1, 'transparent')
    context.fillStyle = gradient
    context.fillRect(0, 0, width, height)
    this.imageCache.set('shadow', context.canvas)
  }

  async drawBackground(context: Context, wheel: Wheel) {
    if (wheel.config.type !== 'image') return
    if (!this.imageCache.has('background')) {
      await this.drawBackgroundNoCache(
        createInMemoryImage(context),
        wheel.config.image
      )
    }
    if (this.imageCache.get('background') === null) return
    context.save()
    const { width, height } = context.canvas
    context.translate(width / 2, height / 2)
    context.rotate(wheel.state.angle)
    context.translate(-width / 2, -height / 2)
    context.drawImage(this.imageCache.get('background')!, 0, 0)
    context.restore()
  }

  async drawBackgroundNoCache(context: Context, dataUri: string) {
    this.imageCache.set('background', null)
    const image = await createImageFromDataUri(dataUri)
    const radius = getWheelRadius(context)
    const scale = radius * 2 / Math.min(image.width, image.height)
    const width = image.width * scale
    const x = (radius * 2 - width) / 2
    const height = image.height * scale
    const y = (radius * 2 - height) / 2
    context.save()
    context.beginPath()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.arc(0, 0, radius, 0, Math.PI * 2)
    context.clip()
    context.translate(-radius, -radius)
    context.drawImage(image, x, y, width, height)
    context.restore()
    this.imageCache.set('background', context.canvas)
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
    this.drawCenter(context, wheel)
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
      radius * 15 / 16,
      radius * hubSizes[wheel.config.hubSize] * 17 / 16,
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
    if (wheel.config.type === 'color') {
      const bgColor = wheel.config.colors[index % wheel.config.colors.length]
      this.drawSliceBg(context, radius, radians, bgColor)
      this.drawText(
        context, wheel.entries[index].text, radius, getTextColor(bgColor)
      )
    } else {
      this.drawText(
        context, wheel.entries[index].text, radius, 'white', 'black'
      )
    }
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
    color: string,
    strokeColor?: string
  ) {
    context.lineJoin = 'round'
    context.textBaseline = 'middle'
    context.textAlign = 'end'
    context.fillStyle = color
    const displayText = truncateText(text)
    if (strokeColor) {
      context.strokeStyle = strokeColor
      context.lineWidth = 3
      context.strokeText(displayText, radius * 15 / 16, 0)
    }
    context.fillText(displayText, radius * 15 / 16, 0)
  }

  drawCenter(context: Context, wheel: Wheel) {
    if (wheel.config.type !== 'color') return
    if (!this.imageCache.has('center')) {
      this.drawCenterNoCache(
        createInMemoryImage(context),
        hubSizes[wheel.config.hubSize]
      )
    }
    context.drawImage(this.imageCache.get('center')!, 0, 0)
  }

  drawCenterNoCache(context: Context, hubSize: number) {
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.beginPath()
    context.arc(0, 0, getWheelRadius(context) * hubSize, 0, 2 * Math.PI)
    context.fillStyle = 'white'
    context.fill()
    this.imageCache.set('center', context.canvas)
  }

  async drawCenterImage(context: Context, wheel: Wheel) {
    if (wheel.config.type !== 'color' || !wheel.config.image) return
    if (!this.imageCache.has('center-image')) {
      this.drawCenterImageNoCache(
        createInMemoryImage(context),
        wheel.config.image,
        hubSizes[wheel.config.hubSize]
      )
    }
    if (this.imageCache.get('center-image') === null) return
    context.save()
    const { width, height } = context.canvas
    context.translate(width / 2, height / 2)
    context.rotate(wheel.state.angle)
    const radius = getWheelRadius(context) * hubSizes[wheel.config.hubSize]
    context.translate(-radius, -radius)
    context.drawImage(this.imageCache.get('center-image')!, 0, 0)
    context.restore()
  }

  async drawCenterImageNoCache(
    context: Context, dataUri: string, hubSize: number
  ) {
    this.imageCache.set('center-image', null)
    const image = await createImageFromDataUri(dataUri)
    const radius = getWheelRadius(context) * hubSize
    const scale = radius * 2 / Math.min(image.width, image.height)
    const width = image.width * scale
    const x = (radius * 2 - width) / 2 - radius
    const height = image.height * scale
    const y = (radius * 2 - height) / 2 - radius
    context.save()
    context.beginPath()
    context.translate(radius, radius)
    context.arc(0, 0, radius, 0, Math.PI * 2, true)
    context.clip()
    context.drawImage(image, x, y, width, height)
    context.restore()
    this.imageCache.set('center-image', context.canvas)
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

const createInMemoryImage = (context: Context) => {
  return createCanvas(
    context.canvas.width, context.canvas.height
  ).getContext('2d')
}

const createImageFromDataUri = (dataUri: string) => {
  return loadImage(dataUri)
}
