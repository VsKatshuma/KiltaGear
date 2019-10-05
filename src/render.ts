import * as PIXI from 'pixi.js'
import { gameState, keys } from './kiltagear'

let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}

let app = new PIXI.Application({width: 256, height: 256})

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
// app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

document.body.appendChild(app.view)


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

