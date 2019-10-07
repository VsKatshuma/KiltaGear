import { Player, PlayerBase, InputStatus } from './types'
import { startGameLoop } from './game-logic/game-loop'
import { Katshuma } from './characters/katshuma'
import { mmKALLL } from './characters/mmkalll';
import { True_mmKALLL } from './characters/true-mmkalll'
import { PlayerInput } from './game-logic/input-handler';


const playerBase: PlayerBase = {
    state: 'groundborne',
    meter: 0,
    xSpeed: 0,
    ySpeed: 0,
    framesUntilNeutral: 0,
    jumps: 2,
}

const playerOne: Player = {
    ...playerBase,
    playerSlot: 0,
    character: Katshuma,
    health: Katshuma.maxHealth,
    x: 500,
    y: 450,
    facing: 'right',
    playerInputs: {
      'w': PlayerInput.Up,
      'a': PlayerInput.Left,
      's': PlayerInput.Down,
      'd': PlayerInput.Right,
      'c': PlayerInput.Light,
      'v': PlayerInput.Special,
      'b': PlayerInput.Meter,
    }
}

const playerTwo: Player = {
    ...playerBase,
    playerSlot: 1,
    character: mmKALLL,
    health: mmKALLL.maxHealth,
    x: 700,
    y: 450,
    facing: 'left',
    playerInputs: {
      'ArrowUp': PlayerInput.Up,
      'ArrowLeft': PlayerInput.Left,
      'ArrowDown': PlayerInput.Down,
      'ArrowRight': PlayerInput.Right,
      ',': PlayerInput.Light,
      '.': PlayerInput.Special,
      '/': PlayerInput.Meter,
      '-': PlayerInput.Meter,
    }
}

export const players: Player[] = [playerOne, playerTwo]

export const keys: InputStatus = {}
export let keysPressed: string[] = []
export let keysReleased: string[] = []
export const clearKeyArrays: () => void = () => { keysPressed = []; keysReleased = [] }

window.addEventListener('keydown', (event: KeyboardEvent) => {
    keysPressed.push(event.key)
    keys[event.key] = {
        keyName: event.key,
        isDown: true,
        lastPressed: Date.now(),
    }
})

window.addEventListener('keyup', (event: KeyboardEvent) => {
    keysReleased.push(event.key)
    keys[event.key].isDown = false
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
