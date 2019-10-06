import * as PIXI from 'pixi.js'
import { GameState } from './types';

var type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas'
}

const app = new PIXI.Application({backgroundColor: 0x7799FF, width: 1200, height: 675})

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

document.body.appendChild(app.view)

const middleX = app.renderer.width / 2
const middleY = app.renderer.height / 2

/*// Character selection screen grid
const characterSelectionColumns = 5
const characterSelectionRows = 1*/

// Title screen
var titleBeam1Url = require('../assets/sprites/title-2.png')
var titleBeam2Url = require('../assets/sprites/title-3.png')
var titleBeam3Url = require('../assets/sprites/title-4.png')
var titleHoverUrl = require('../assets/sprites/title.png')

const titleBeam1 = PIXI.Sprite.from(titleBeam1Url)
const titleBeam2 = PIXI.Sprite.from(titleBeam2Url)
const titleBeam3 = PIXI.Sprite.from(titleBeam3Url)
const titleEsa = PIXI.Sprite.from(titleHoverUrl)

titleBeam1.anchor.set(0.5, 0.5)
titleBeam2.anchor.set(0.5, 0.5)
titleBeam3.anchor.set(0.5, 0.5)
app.stage.addChild(titleBeam1)
app.stage.addChild(titleBeam2)
app.stage.addChild(titleBeam3)
app.stage.addChild(titleEsa)

titleBeam1.x, titleBeam2.x, titleBeam3.x = middleX
titleBeam1.y, titleBeam2.y, titleBeam3.y = middleY

// Character selection
var characterSelectKatshumaUrl = require('../assets/sprites/character-select-katshuma.jpg')
var characterSelectmmKALLLUrl = require('../assets/sprites/character-select-mmkalll.jpg')
var characterSelectTruemmKALLLUrl = require('../assets/sprites/character-select-true-mmkalll.jpg')

const characterSelectionImageKatshuma = PIXI.Sprite.from(characterSelectKatshumaUrl)
const characterSelectionImagemmKALLL = PIXI.Sprite.from(characterSelectmmKALLLUrl)
const characterSelectionImageTruemmKALLL = PIXI.Sprite.from(characterSelectTruemmKALLLUrl)

characterSelectionImageKatshuma.anchor.set(0.5, 0.5)
characterSelectionImagemmKALLL.anchor.set(0.5, 0.5)
characterSelectionImageTruemmKALLL.anchor.set(0.5, 0.5)

characterSelectionImageKatshuma.x = middleX - 500
characterSelectionImageKatshuma.y = middleY
characterSelectionImagemmKALLL.x = middleX + 500
characterSelectionImagemmKALLL.y = middleY

const player1selection = new PIXI.Graphics()
player1selection.lineStyle(4, 0xFF0000, 1)
player1selection.moveTo(0, 0)
player1selection.lineTo(64, 0)
player1selection.lineTo(64, 64)
player1selection.lineTo(0, 64)
player1selection.lineTo(0, 0)
player1selection.pivot.set(32, 32)
//player1selection.x = middleX - (characterSelectionColumns / 2) * 64
player1selection.y = middleY
//app.stage.addChild(player1selection)

const player2selection = new PIXI.Graphics()
player2selection.lineStyle(4, 0xFFFF00, 1)
player2selection.moveTo(0, 0)
player2selection.lineTo(64, 0)
player2selection.lineTo(64, 64)
player2selection.lineTo(0, 64)
player2selection.lineTo(0, 0)
player2selection.pivot.set(32, 32)
//player2selection.x = middleX + (characterSelectionColumns / 2) * 64
player2selection.y = middleY
//app.stage.addChild(player2selection)

const characterSelectionBackgroundVertical = new PIXI.Graphics()
characterSelectionBackgroundVertical.lineStyle(4, 0x000000, 0.65)
for (var x = -64; x < app.renderer.width; x += 64) {
    characterSelectionBackgroundVertical.moveTo(x, 0)
    characterSelectionBackgroundVertical.lineTo(x, app.renderer.height)
}
const characterSelectionBackgroundHorizontal = new PIXI.Graphics()
characterSelectionBackgroundHorizontal.lineStyle(4, 0x000000, 0.65)
for (var y = -64; y < app.renderer.height; y += 64) {
    characterSelectionBackgroundHorizontal.moveTo(0, y)
    characterSelectionBackgroundHorizontal.lineTo(app.renderer.width, y)
}

// Characters
var characterBaseUrl = require('../assets/sprites/character.png')
var ingameKatshumaUrl = require('../assets/sprites/in-game-katshuma.jpg')
var ingamemmKALLLUrl = require('../assets/sprites/in-game-mmkalll.jpg')

const characterBody1 = PIXI.Sprite.from(characterBaseUrl)
const characterBody2 = PIXI.Sprite.from(characterBaseUrl)
const ingameKatshuma = PIXI.Sprite.from(ingameKatshumaUrl)
const ingamemmKALLL = PIXI.Sprite.from(ingamemmKALLLUrl)

ingameKatshuma.width = 40
ingameKatshuma.height = 40

ingamemmKALLL.width = 40
ingamemmKALLL.height = 40

ingameKatshuma.x = 30
ingameKatshuma.y = 5

ingamemmKALLL.x = 30
ingamemmKALLL.y = 5

const player1 = new PIXI.Container()
const player2 = new PIXI.Container()

player1.addChild(characterBody1)
player1.addChild(ingameKatshuma)
player2.addChild(characterBody2)
player2.addChild(ingamemmKALLL)

const hurtboxes = new PIXI.Graphics()
hurtboxes.alpha = 0.5

// Backgrounds
var backgroundUrl = require('../assets/sprites/ingame-6.jpg')

const background1 = PIXI.Sprite.from(backgroundUrl)

background1.width = window.innerWidth
background1.height = window.innerHeight

function transitionToTitleScreen(): void {
    app.renderer.backgroundColor = 0x7799FF
    app.stage.removeChildren()
    app.stage.addChild(titleBeam1)
    app.stage.addChild(titleBeam2)
    app.stage.addChild(titleBeam3)
    app.stage.addChild(titleEsa)
}

function transitionToCharacterSelect(): void {
    app.renderer.backgroundColor = 0xFF0000
    app.stage.removeChildren()
    app.stage.addChild(characterSelectionBackgroundVertical)
    app.stage.addChild(characterSelectionBackgroundHorizontal)
    app.stage.addChild(characterSelectionImageKatshuma)
    app.stage.addChild(characterSelectionImagemmKALLL)
}

function transitionToIngame(): void {
    app.stage.removeChildren()
    app.stage.addChild(background1)
    app.stage.addChild(player1)
    app.stage.addChild(player2)
    app.stage.addChild(hurtboxes)
}

let previousScreen = 'title-screen'

export function render(state: GameState): void {
    if (state.screen === 'title-screen') {
        if (previousScreen != 'title-screen') {
            previousScreen = 'title-screen'
            transitionToTitleScreen()
        }
        titleBeam1.rotation += 0.005
        titleBeam2.rotation += 0.005
        titleBeam3.rotation += 0.005
    }
    if (state.screen === 'character-select') {
        if (previousScreen != 'character-select') {
            previousScreen = 'character-select'
            transitionToCharacterSelect()
        }
        characterSelectionBackgroundVertical.x = (characterSelectionBackgroundVertical.x + 0.5) % 64
        characterSelectionBackgroundHorizontal.y = (characterSelectionBackgroundHorizontal.y + 1) % 64
    }
    if (state.screen === 'in-game') {
        if (previousScreen != 'in-game') {
            previousScreen = 'in-game'
            transitionToIngame()
        }
        state.players.forEach(player => {
            // Draw something at (player.x, player.y)
            // Need to implement player sprites in a smart way first
        })
        player1.x = state.players[0].x
        player1.y = state.players[0].y
        player2.x = state.players[1].x
        player2.y = state.players[1].y
        hurtboxes.clear()
        hurtboxes.beginFill(0x6688FF)
        hurtboxes.drawCircle(player1.x + 50, player1.y + 50, state.players[0].character.hurtboxRadius)
        hurtboxes.drawCircle(player2.x + 50, player2.y + 50, state.players[1].character.hurtboxRadius)
        hurtboxes.endFill()
    }
}
