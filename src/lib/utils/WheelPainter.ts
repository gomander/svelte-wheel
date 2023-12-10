import { getFont } from '$lib/utils/FontPicker'
import type Wheel from '$lib/utils/Wheel'

export default class WheelPainter {
  draw(context: CanvasRenderingContext2D, wheel: Wheel) {
    this.drawShadow(context)
    this.drawWheel(context, wheel)
    this.drawPointer(context)
  }

  drawShadow(context: CanvasRenderingContext2D) {
    const { width, height } = context.canvas
    const x = width / 2
    const y = height / 2
    const radius = this.getWheelRadius(context)
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
  }

  drawWheel(context: CanvasRenderingContext2D, wheel: Wheel) {
    context.save()
    this.drawSlices(context, wheel)
    this.drawCenter(context)
    context.restore()
  }

  drawSlices(context: CanvasRenderingContext2D, wheel: Wheel) {
    context.save()
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    const radius = this.getWheelRadius(context)
    context.font = getFont(
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
  }

  drawSlice(context: CanvasRenderingContext2D, wheel: Wheel, index: number) {
    const radius = this.getWheelRadius(context)
    const radians = 2 * Math.PI / wheel.entries.length
    const bgColor = wheel.config.colors[index % wheel.config.colors.length]
    this.drawSliceBg(context, radius, radians, bgColor)
    this.drawText(context, wheel.entries[index].text, radius, 'black')
  }

  drawSliceBg(
    context: CanvasRenderingContext2D,
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
    context: CanvasRenderingContext2D,
    text: string,
    radius: number,
    color: string
  ) {
    context.lineJoin = 'round'
    context.textBaseline = 'middle'
    context.textAlign = 'end'
    context.fillStyle = color
    context.fillText(text, radius * 15 / 16, 0)
  }

  drawCenter(context: CanvasRenderingContext2D) {
    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.beginPath()
    context.arc(0, 0, this.getWheelRadius(context) / 5, 0, 2 * Math.PI)
    context.fillStyle = 'white'
    context.fill()
  }

  drawPointer(context: CanvasRenderingContext2D) {
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
  }

  getWheelRadius(context: CanvasRenderingContext2D) {
    return Math.min(context.canvas.width, context.canvas.height) / 2 * 0.85
  }
}
