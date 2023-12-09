import type Wheel from '$lib/utils/Wheel'

export default class WheelPainter {
  wheelScale = 0.85

  draw(context: CanvasRenderingContext2D, wheel: Wheel) {
    this.drawShadow(context)
    context.font = '30px monospace'
    this.drawWheel(context, wheel)
  }

  drawShadow(context: CanvasRenderingContext2D) {
    const { width, height } = context.canvas
    const x = width / 2
    const y = height / 2
    const wheelRadius = Math.min(width, height) / 2 * this.wheelScale
    const gradient = context.createRadialGradient(
      x,
      y,
      wheelRadius,
      x,
      y + wheelRadius / 75,
      wheelRadius + wheelRadius / 25
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
    wheel.entries.forEach((_entry, index) => {
      this.drawSlice(context, wheel, index)
      context.rotate(-2 * Math.PI / wheel.entries.length)
    })
    context.restore()
  }

  drawSlice(context: CanvasRenderingContext2D, wheel: Wheel, index: number) {
    const { width, height } = context.canvas
    const radius = Math.min(width, height) / 2 * this.wheelScale
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
    const { width, height } = context.canvas
    const radius = Math.min(width, height) / 4 * this.wheelScale
    context.translate(width / 2, height / 2)
    context.beginPath()
    context.arc(0, 0, radius / 2, 0, 2 * Math.PI)
    context.fillStyle = 'white'
    context.fill()
  }
}
