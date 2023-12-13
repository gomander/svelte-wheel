import { FPS } from '$lib/utils/Ticker'

export interface WheelState {
  angle: number
  speed: number
  phase: Phase
  ticksInPhase: number
}

type Phase = 'demo' | 'accelerating' | 'decelerating' | 'stopped'
type WheelStateFn = (state: WheelState, ...args: any) => WheelState

const DEMO_SPEED = 0.005
const STOP_SPEED = 0.00015

export const initialWheelState: WheelState = {
  angle: 0,
  speed: DEMO_SPEED,
  phase: 'demo',
  ticksInPhase: 0
}

export const click: WheelStateFn = (state: WheelState) => {
  const handleClickForPhase: Record<Phase, WheelStateFn> = {
    demo: (state: WheelState) => goToPhase(state, 'accelerating'),
    accelerating: (state: WheelState) => state,
    decelerating: (state: WheelState) => state,
    stopped: (state: WheelState) => goToPhase(state, 'accelerating')
  }
  return handleClickForPhase[state.phase](state)
}

export const tick: WheelStateFn = (state: WheelState, spinTime: number) => {
  const processTickForPhase: Record<Phase, WheelStateFn> = {
    demo: (state: WheelState) => ({ ...state, speed: DEMO_SPEED }),
    accelerating: (state: WheelState) => tickAcceleratingPhase(state, spinTime),
    decelerating: (state: WheelState) => tickDeceleratingPhase(state, spinTime),
    stopped: (state: WheelState) => ({ ...state, speed: 0 })
  }
  return increaseTicksInPhase(
    processTickForPhase[state.phase](
      increaseAngle(state)
    )
  )
}

const increaseAngle: WheelStateFn = (state: WheelState) => {
  let angle = state.angle + state.speed
  if (angle >= 2 * Math.PI) angle -= 2 * Math.PI
  return { ...state, angle }
}

const increaseTicksInPhase: WheelStateFn = (state: WheelState) => (
  { ...state, ticksInPhase: state.ticksInPhase + 1 }
)

const tickAcceleratingPhase: WheelStateFn = (
  state: WheelState, spinTime: number
) => state.ticksInPhase >= getAccelTicks(spinTime)
  ? goToDeceleratingPhase(state)
  : { ...state, speed: state.speed + getAccelRate() }

const tickDeceleratingPhase: WheelStateFn = (
  state: WheelState, spinTime: number
) => state.ticksInPhase >= getDecelTicks(spinTime)
  ? goToPhase(state, 'stopped')
  : { ...state, speed: state.speed * getDecelRate(spinTime) }

const goToDeceleratingPhase: WheelStateFn = (state: WheelState) => ({
  ...state,
  angle: Math.random() * 2 * Math.PI,
  phase: 'decelerating',
  ticksInPhase: 0
})

const goToPhase: WheelStateFn = (state: WheelState, phase: Phase) => (
  { ...state, phase, ticksInPhase: 0 }
)

const getAccelTicks = (spinTime: number) => (
  Math.min(FPS, Math.floor(spinTime * FPS / 3))
)

const getAccelRate = () => 0.6 / FPS

const getDecelTicks = (spinTime: number) => (
  spinTime * FPS - getAccelTicks(spinTime)
)

const getDecelRate = (spinTime: number) => Math.exp(
  Math.log(
    STOP_SPEED / (DEMO_SPEED + getAccelTicks(spinTime) * getAccelRate())
  ) / getDecelTicks(spinTime)
)
