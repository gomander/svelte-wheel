import { z } from 'zod'
import { wheelTypes, hubSizeKeys } from '$lib/utils/WheelConfig'
import { confettiTypes } from '$lib/utils/ConfettiLauncher'

export const wheelSchema = z.object({
  wheel: z.object({
    config: z.object({
      type: z.enum(wheelTypes),
      title: z.string().min(1).max(50),
      description: z.string().max(200),
      spinTime: z.number().min(1).max(60),
      indefiniteSpin: z.boolean(),
      colors: z.array(z.string().length(7)),
      confetti: z.enum(confettiTypes),
      displayWinnerDialog: z.boolean(),
      winnerMessage: z.string().max(50),
      hubSize: z.enum(hubSizeKeys),
      duringSpinSound: z.string().max(100),
      duringSpinSoundVolume: z.number().min(0).max(1),
      afterSpinSound: z.string().max(100),
      afterSpinSoundVolume: z.number().min(0).max(1),
      image: z.string()
    }),
    entries: z.array(
      z.object({
        text: z.string(),
        id: z.string().min(5).max(20)
      })
    )
  }),
  visibility: z.enum(['public', 'private']),
  uid: z.string()
})

export const emailValidator = z.string().email()

export const userSchema = z.object({
  email: emailValidator,
  password: z.string().min(8, 'Password must be at least 8 characters').trim()
})
