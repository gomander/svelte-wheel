import confetti from 'canvas-confetti'
import type { ConfettiType } from '$lib/utils/WheelConfig'

export const launchConfetti = (
  confettiType: ConfettiType, colors: string[]
) => {
  switch (confettiType) {
    case 'fireworks':
      const interval = setInterval(
        () => confettiLaunchers.fireworks(colors), 250
      )
      setTimeout(() => clearInterval(interval), 3000)
      break
    case 'cannons':
      confettiLaunchers.cannons(colors)
      setTimeout(() => confettiLaunchers.cannons(colors), 100)
      break
    case 'stars':
      confettiLaunchers.stars(colors)
      setTimeout(() => confettiLaunchers.stars(colors), 100)
      setTimeout(() => confettiLaunchers.stars(colors), 200)
      break
  }
}

const confettiLaunchers: Record<ConfettiType, (colors: string[]) => void> = {
  off: () => {},
  fireworks: (colors: string[]) => {
    confetti({
      particleCount: 50,
      spread: 360,
      ticks: 60,
      startVelocity: 30,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors,
      zIndex: 1000
    })
    confetti({
      particleCount: 50,
      spread: 360,
      ticks: 60,
      startVelocity: 30,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors,
      zIndex: 1000
    })
  },
  cannons: (colors: string[]) => {
    confetti({
      particleCount: 100,
      spread: 60,
      angle: 45,
      origin: { x: -0.1, y: 0.6 },
      colors,
      zIndex: 1000
    })
    confetti({
      particleCount: 100,
      spread: 60,
      angle: 135,
      origin: { x: 1.1, y: 0.6 },
      colors,
      zIndex: 1000
    })
  },
  stars: (colors: string[]) => {
    confetti({
      particleCount: 80,
      spread: 360,
      scalar: 1.2,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors,
      zIndex: 1000
    })
    confetti({
      particleCount: 20,
      spread: 360,
      scalar: 0.75,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['circle'],
      colors,
      zIndex: 1000
    })
  }
}

const randomInRange = (min: number, max: number) => (
  Math.random() * (max - min) + min
)
