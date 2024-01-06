import Wheel from '$lib/utils/Wheel'
import WheelPainter from '$lib/utils/WheelPainter'

let context: OffscreenCanvasRenderingContext2D
const painter = new WheelPainter()

let wheel = new Wheel()

onmessage = event => {
  if ('canvas' in event.data) {
    context = (event.data.canvas as OffscreenCanvas).getContext('2d')!
  }
  if ('wheel' in event.data) {
    wheel = new Wheel(event.data.wheel)
    painter.refresh()
  }
  if ('angle' in event.data) {
    wheel.state.angle = event.data.angle
    painter.draw(context, wheel)
  }
  if ('config' in event.data) {
    wheel.setConfig(event.data.config)
    painter.refresh()
  }
  if ('entries' in event.data) {
    wheel.setEntries(event.data.entries)
    painter.refresh()
  }
  if ('refresh' in event.data) {
    painter.refresh()
  }
}
