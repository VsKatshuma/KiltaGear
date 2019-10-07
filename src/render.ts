import * as PIXI from 'pixi.js'
import { GameState } from './types';
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';

var type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas'
}

const app = new PIXI.Application({backgroundColor: 0x7799FF, width: 1200, height: 675})
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = false
app.renderer.resize(windowWidth, windowHeight)

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

titleBeam1.x, titleBeam2.x, titleBeam3.x = middleX
titleBeam1.y, titleBeam2.y, titleBeam3.y = middleY

const titleTextStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 108,
    fontWeight: 'bold',
    fill: ['#FF0000', '#FFFFFF', '#FFFF00'],
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: '#000000'
})

const pressAnyKeyTextStyle = new PIXI.TextStyle({
    fontSize: 30
})

const titleText = new PIXI.Text('KiltaGear', titleTextStyle)
titleText.anchor.set(0.5)
const versionNumber = new PIXI.Text('v0.5', new PIXI.TextStyle({fontSize: 22}))
versionNumber.x = 195
versionNumber.y = 45
const pressAnyKeyText = new PIXI.Text('Press any key to continue', pressAnyKeyTextStyle)
pressAnyKeyText.anchor.set(0.5)
pressAnyKeyText.y = 190

const titleContainer = new PIXI.Container()
titleContainer.x = middleX
titleContainer.y = middleY
titleContainer.addChild(titleText)
titleContainer.addChild(versionNumber)
titleContainer.addChild(pressAnyKeyText)

app.stage.addChild(titleBeam1)
app.stage.addChild(titleBeam2)
app.stage.addChild(titleBeam3)
app.stage.addChild(titleEsa)
app.stage.addChild(titleContainer)

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

const characterSelectionLeft = new PIXI.Container()
const characterSelectionRight = new PIXI.Container()
characterSelectionLeft.x = middleX - 400
characterSelectionLeft.y = middleY
characterSelectionRight.x = middleX + 400
characterSelectionRight.y = middleY

const characterSelectionTextStyleLeft = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: ['#FF0000'],
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowAngle: 0,
    dropShadowDistance: 1
})
const characterSelectionTextStyleRight = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontWeight: 'bold',
    fill: ['#FFFF00'],
    stroke: '#000000',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowAngle: 0,
    dropShadowDistance: 1
})

const characterSelectionTextLeft = new PIXI.Text('Katshuma', characterSelectionTextStyleLeft)
const characterSelectionTextRigth = new PIXI.Text('mmKALLL', characterSelectionTextStyleRight)
characterSelectionTextLeft.anchor.set(0.5)
characterSelectionTextRigth.anchor.set(0.5)
characterSelectionTextLeft.y = 230
characterSelectionTextRigth.y = 230

characterSelectionLeft.addChild(characterSelectionImageKatshuma)
characterSelectionLeft.addChild(characterSelectionTextLeft)
characterSelectionRight.addChild(characterSelectionImagemmKALLL)
characterSelectionRight.addChild(characterSelectionTextRigth)

const versus = new PIXI.Text("VS.", titleTextStyle)
versus.anchor.set(0.5, 0.5)
versus.x = middleX
versus.y = middleY

const readyToStartTextStyle = new PIXI.TextStyle({
    fontSize: 30
})
const readyToStart = new PIXI.Text('Press any key to start', readyToStartTextStyle)
readyToStart.anchor.set(0.5)
readyToStart.x = middleX
readyToStart.y = middleY + 230

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
ingameKatshuma.x = 30
ingameKatshuma.y = 5

ingamemmKALLL.width = 40
ingamemmKALLL.height = 40
ingamemmKALLL.x = 30
ingamemmKALLL.y = 5

const container1 = new PIXI.Container()
const container2 = new PIXI.Container()

container1.pivot.set(0.5)
container2.pivot.set(0.5)

container1.addChild(characterBody1)
container1.addChild(ingameKatshuma)
container2.addChild(characterBody2)
container2.addChild(ingamemmKALLL)

const hurtboxes = new PIXI.Graphics()
hurtboxes.alpha = 0.5

const hitboxes = new PIXI.Graphics()
hitboxes.alpha = 0.5

// Backgrounds
var backgroundUrl = require('../assets/sprites/ingame-6.jpg')

const background1 = PIXI.Sprite.from(backgroundUrl) // 2730 (width of original image) / 2.275 = 1200

const backgroundOriginalWidth = 2730 // background1 width is currently hardcoded to be 2730
const backgroundOriginalHeight = 1536 // background1 height is currently hardcoded to be 1536

function transitionToTitleScreen(): void {
    app.renderer.backgroundColor = 0x7799FF
    app.stage.removeChildren()
    app.stage.addChild(titleBeam1)
    app.stage.addChild(titleBeam2)
    app.stage.addChild(titleBeam3)
    app.stage.addChild(titleEsa)
    app.stage.addChild(titleContainer)
}

function transitionToCharacterSelect(): void {
    app.renderer.backgroundColor = 0xAA0000
    app.stage.removeChildren()
    app.stage.addChild(characterSelectionBackgroundVertical)
    app.stage.addChild(characterSelectionBackgroundHorizontal)
    app.stage.addChild(characterSelectionLeft)
    app.stage.addChild(characterSelectionRight)
    app.stage.addChild(versus)
    app.stage.addChild(readyToStart)
}

function transitionToIngame(): void {
    app.stage.removeChildren()
    app.stage.addChild(background1)
    app.stage.addChild(container1)
    app.stage.addChild(container2)
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
        
        // Camera
        let cameraLeft = state.players[0].x < state.players[1].x ? state.players[0].x - 200 : state.players[1].x - 200
        let cameraRight = state.players[0].x > state.players[1].x ? state.players[0].x + 200 : state.players[1].x + 200
        cameraLeft = cameraLeft < 0 ? 0 : cameraLeft
        cameraRight = cameraRight > 1200 ? 1200 : cameraRight
        let characterYDifference = Math.abs(state.players[0].y - state.players[1].y)
        if (characterYDifference > 0) {
            cameraLeft -= characterYDifference / 2
            cameraRight += characterYDifference / 2
            if (cameraLeft < 0) {
                cameraRight -= cameraLeft
                cameraLeft = 0 
            }
            if (cameraRight > 1200) {
                cameraLeft -= cameraRight - 1200
                cameraRight = 1200
            }
            if (cameraLeft < 0) {
                cameraLeft = 0
            }
        }
        let visibleAreaWidth = cameraRight - cameraLeft
        let howManyPixelsX = backgroundOriginalWidth * (visibleAreaWidth / 1200)
        // pikselien määrä, mikä alkuperäisestä taustasta on näkyvissä
        
        // niin monta pikseliä täytyy mahduttaa tilaan "windowWidth"
        // saadaan skaala, jolla alkuperäinen width täytyy kertoa
        let scaleBackground = windowWidth / howManyPixelsX
        background1.width = backgroundOriginalWidth * scaleBackground
        background1.height = backgroundOriginalHeight * scaleBackground
        
        // cameraLeft / 1200 on kuinka suuri osa background1.widthistä jää kuvan vasemmalle puolelle
        background1.x = background1.width * (-cameraLeft / 1200)
        background1.y = windowHeight - background1.height
        
        // Players
        let playerScale = background1.width / windowWidth
        container1.scale.set(playerScale)
        container2.scale.set(playerScale)
        let pixelScale = windowWidth / visibleAreaWidth
        container1.x = ((state.players[0].x - cameraLeft) * pixelScale) - (50 * playerScale)
        container2.x = ((state.players[1].x - cameraLeft) * pixelScale) - (50 * playerScale)
        // windowHeight / background1.height kertoo, miten suuri osuus taustakuvan alaosasta on näkyvissä
        container1.y = ((state.players[0].y - (675 - (675 * windowHeight / background1.height))) / (675 * windowHeight / background1.height) * windowHeight) - (50 * playerScale)
        container2.y = ((state.players[1].y - (675 - (675 * windowHeight / background1.height))) / (675 * windowHeight / background1.height) * windowHeight) - (50 * playerScale)
        
        hurtboxes.clear()
        hurtboxes.beginFill(0x6688FF)
        hurtboxes.drawCircle(
            container1.x + (50 * playerScale),
            container1.y + (50 * playerScale),
            state.players[0].character.hurtboxRadius * playerScale
        )
        hurtboxes.drawCircle(
            container2.x + (50 * playerScale),
            container2.y + (50 * playerScale),
            state.players[1].character.hurtboxRadius * playerScale
        )
        hurtboxes.endFill()
        
        hitboxes.clear()
        hitboxes.beginFill(0xDD0000)
        state.activeAttacks.forEach(attack => {
            attack.hitboxes.forEach(hitbox => {
                if (hitbox.framesUntilActivation <= 0) {
                    if (hitbox.relativeToCharacter) {
                        if (attack.player === 1) {
                            hitboxes.drawCircle(
                                container1.x + (50 * playerScale) + (hitbox.x * playerScale),
                                container1.y + (50 * playerScale) + (hitbox.y * playerScale),
                                hitbox.radius * playerScale
                            )
                        } else if (attack.player === 2) {
                            hitboxes.drawCircle(
                                container2.x + (50 * playerScale) + (hitbox.x * playerScale),
                                container2.y + (50 * playerScale) + (hitbox.y * playerScale),
                                hitbox.radius * playerScale
                            )
                        } else {
                            console.log('Renreding hitboxes is not implemented for more than 2 players')
                        }
                    } else {
                        hitboxes.drawCircle(
                            ((hitbox.x - cameraLeft) * pixelScale) - (50 * playerScale),
                            ((hitbox.y - (675 - (675 * windowHeight / background1.height))) / (675 * windowHeight / background1.height) * windowHeight) - (50 * playerScale),
                            hitbox.radius * playerScale
                        )
                    }
                }
            })
        })
        hitboxes.endFill()
    }
}
            