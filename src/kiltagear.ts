import * as PIXI from 'pixi.js'

let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}

let app = new PIXI.Application({width: 256, height: 256})

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

document.body.appendChild(app.view)

// Game state
const gameState = {
  screen: 'character-select',
  state: {}
}

interface KeyStatus {
  isDown: boolean;
  lastPressed?: number;
}

const keys: { [key: string]: KeyStatus } = {}

window.addEventListener('keydown', (event: KeyboardEvent) => {
  keys[event.key] = { isDown: true, lastPressed: Date.now() }
  switch (gameState.screen) {
    case 'in-game':
      console.log(`pressed ${event.key}`)
    break
    case 'character-select':

    break
    case 'title-screen':
      break
    default:
      throw new Error(`unknown gs.screen when pressing key\nscreen: ${gameState.screen}\nkey event: ${event}`)
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

let middleX = app.renderer.width / 2
let middleY = app.renderer.height / 2

// Character selection screen grid
let characterSelectionColumns = 5
let characterSelectionRows = 1

let player1selection = new PIXI.Graphics()
player1selection.lineStyle(4, 0xFFFFFF, 1)
player1selection.moveTo(0, 0)
player1selection.lineTo(64, 0)
player1selection.lineTo(64, 64)
player1selection.lineTo(0, 64)
player1selection.lineTo(0, 0)
player1selection.pivot.set(32, 32)
player1selection.x = middleX - (characterSelectionColumns / 2) * 64
player1selection.y = middleY
app.stage.addChild(player1selection)

let player2selection = new PIXI.Graphics()
player2selection.lineStyle(4, 0xFFFF00, 1)
player2selection.moveTo(0, 0)
player2selection.lineTo(64, 0)
player2selection.lineTo(64, 64)
player2selection.lineTo(0, 64)
player2selection.lineTo(0, 0)
player2selection.pivot.set(32, 32)
player2selection.x = middleX + (characterSelectionColumns / 2) * 64
player2selection.y = middleY
app.stage.addChild(player2selection)

PIXI.loader.add([
  'assets/sprites/sonic-battle.png'
]).load(setup)

function setup() {
  let sprite = new PIXI.Sprite(
    PIXI.loader.resources['assets/sprites/sonic-battle.png'].texture
  )
  sprite.pivot.set(20, 29)
  app.stage.addChild(sprite)

  sprite.x = middleX
  sprite.y = middleY
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
