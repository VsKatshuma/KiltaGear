import { Hitbox, Attack, Character, Player, GameScreen, CharacterState, PlayerBase } from './types'
import { startGameLoop } from './gameloop'
import { Katshuma } from './characters/katshuma'
import { True_mmKALLL } from './characters/mmkalll'

const playerBase: PlayerBase = {
    state: 'groundborne',
    meter: 0,
    xSpeed: 0,
    ySpeed: 0,
    framesUntilNeutral: 0,
}

const playerOne: Player = {
    ...playerBase,
    playerPort: 1,
    character: Katshuma,
    x: 500,
    y: 450,
    facing: 'right',
}
const playerTwo: Player = {
    ...playerBase,
    playerPort: 2,
    character: True_mmKALLL,
    x: 700,
    y: 450,
    facing: 'left'
}

export const players = [playerOne, playerTwo]

type KeyStatus = {
  isDown: boolean
  lastPressed?: number
}

export const keys: { [key: string]: KeyStatus } = {}

window.addEventListener('keydown', (event: KeyboardEvent) => {
    keys[event.key] = { isDown: true, lastPressed: Date.now() }
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
  keys[event.key] = { isDown: false }
})

startGameLoop()

/*
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
*/
