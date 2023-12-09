import type Wheel from '$lib/utils/Wheel'

export default class WheelPainter {
  wheelScale = 0.85

  draw(context: CanvasRenderingContext2D, wheel: Wheel) {
    context.fillStyle = 'white'
    context.font = '20px monospace'
    context.fillText(JSON.stringify(wheel), 0, 20)
    this.drawWheel(context, wheel)
  }

  drawWheel(context: CanvasRenderingContext2D, wheel: Wheel) {
    const { width, height } = context.canvas
    context.save()
    context.translate(width / 2, height / 2)
    context.ellipse(0, 0, width / 2 * this.wheelScale, height / 2 * this.wheelScale, 0, 0, 2 * Math.PI)
    context.fill()
    context.restore()
  }
}
