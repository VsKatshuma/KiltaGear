import { Hitbox, Attack } from './types'
import { player1selection, player2selection } from './render';

export const createHitbox = (startFrame: number, endFrame: number, strength: number = 4): Hitbox => {
    return {
        damage: strength,
        radius: strength * 3,
        knockbackBase: strength * 20,
        knockbackGrowth: 0,
        knockbackX: 0,
        knockbackY: 0,
        hitstunBase: 0,
        hitstunGrowth: 0,
        hitLag: 0,
        //characterSpecific: 0,
        relativeToCharacter: false,
        x: 0,
        y: 0,
        framesUntilActivation: startFrame,
        framesUntilEnd: endFrame,
        onStart: () => {},
        onActivation: () => {},
        onHit: () => {},
        onEnd: () => {}
    }
}

export const generateAttack = (hitboxes: Hitbox[]): Attack => {
    return {
        hitboxes: hitboxes,
        projectile: false,
        onStart: () => {},
        onEnd: () => {}
    }
}

function initializePlayer() {
    return {
        state: 'groundborne',
        health: 100,
        meter: 0,
        speed: 0,
        direction: 0,
        framesUntilNeutral: 0,
        weight: 1,
        hurtboxRadius: 20
    }
}

const playerOne = {
    ...initializePlayer(),
    x: 500,
    y: 450,
    facing: 'right',
}
const playerTwo = {
    ...initializePlayer(),
    x: 700,
    y: 450,
    facing: 'left'
}

// Game state
export let gameState: 'title-screen' | 'character-select' | 'in-game' = 'title-screen'

interface KeyStatus {
  isDown: boolean;
  lastPressed?: number;
}

export const keys: { [key: string]: KeyStatus } = {}

window.addEventListener('keydown', (event: KeyboardEvent) => {
    keys[event.key] = { isDown: true, lastPressed: Date.now() }
    console.log(`pressed ${event.key} in state ${gameState}`)
    switch (gameState) {
        case 'in-game':
            gameState = 'title-screen'
            break
        case 'character-select':
            gameState = 'in-game'
            break
        case 'title-screen':
            gameState = 'character-select'
            break
        default:
            throw new Error(`unknown game state when pressing key\nscreen: ${gameState}\nkey event: ${event}`)
  }
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
  keys[event.key] = { isDown: false }
})

function keyboard(value: string) {
  let key: any = {}
  key.value = value
  key.isDown = false
  key.isUp = true
  key.press = undefined
  key.release = undefined

  key.downHandler = (event: KeyboardEvent) => {
    if (event.key === key.value) {
      //if (key.isUp && key.press) key.press()
      if (key.press) key.press()
      key.isDown = true
      key.isUp = false
      event.preventDefault()
    }
  }

  key.upHandler = (event: KeyboardEvent) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release()
      key.isDown = false
      key.isUp = true
      event.preventDefault()
    }
  }

  //Attach event listeners
  const downListener = key.downHandler.bind(key)
  const upListener = key.upHandler.bind(key)

  window.addEventListener(
    'keydown', downListener, false
  )
  window.addEventListener(
    'keyup', upListener, false
  )

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener)
    window.removeEventListener('keyup', upListener)
  }

  return key
}

let characterSelectionA = keyboard('a')
characterSelectionA.press = () => {
  player1selection.x -= 64
}
let characterSelectionD = keyboard('d')
characterSelectionD.press = () => {
  player1selection.x += 64
}
let characterSelectionW = keyboard('w')
characterSelectionW.press = () => {
  player1selection.y -= 64
}
let characterSelectionS = keyboard('s')
characterSelectionS.press = () => {
  player1selection.y += 64
}

let characterSelectionLeft = keyboard('ArrowLeft')
characterSelectionLeft.press = () => {
  player2selection.x -= 64
}
let characterSelectionRight = keyboard('ArrowRight')
characterSelectionRight.press = () => {
  player2selection.x += 64
}
let characterSelectionUp = keyboard('ArrowUp')
characterSelectionUp.press = () => {
  player2selection.y -= 64
}
let characterSelectionDown = keyboard('ArrowDown')
characterSelectionDown.press = () => {
  player2selection.y += 64
}
