export interface WheelState {
  angle: number
  speed: number
  phase: Phase
}

type Phase = 'demo' | 'accelerating' | 'decelerating' | 'stopped'

export const initialWheelState: WheelState = {
  angle: 0,
  speed: 0.005,
  phase: 'demo'
}
