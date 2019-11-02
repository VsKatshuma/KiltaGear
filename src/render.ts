import * as PIXI from 'pixi.js'
import { GameState } from './types';
import { hasHitboxEnded, isHitboxActive } from './utilities';

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
var titleBeam1Url = require('./assets/sprites/title-2.png')
var titleBeam2Url = require('./assets/sprites/title-3.png')
var titleBeam3Url = require('./assets/sprites/title-4.png')
var titleHoverUrl = require('./assets/sprites/title.png')

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
var characterSelectKatshumaUrl = require('./assets/sprites/character-select-katshuma.jpg')
var characterSelectmmKALLLUrl = require('./assets/sprites/character-select-mmkalll.jpg')
var characterSelectTruemmKALLLUrl = require('./assets/sprites/character-select-true-mmkalll.jpg')

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

const instructionsLeft = new PIXI.Text('Move: WASD\nAttack: C', readyToStartTextStyle)
const instructionsRight = new PIXI.Text('Move: Arrow keys\nAttack: Comma (,)', readyToStartTextStyle)
instructionsLeft.anchor.set(0.5)
instructionsRight.anchor.set(0.5)
instructionsLeft.x = middleX - 400
instructionsLeft.y = middleY + 290
instructionsRight.x = middleX + 400
instructionsRight.y = middleY + 290

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

// In-game characters
var characterBaseUrl = require('./assets/sprites/character.png')
var ingameKatshumaUrl = require('./assets/sprites/in-game-katshuma.jpg')
var ingamemmKALLLUrl = require('./assets/sprites/in-game-mmkalll.jpg')

const characterBody1 = PIXI.Sprite.from(characterBaseUrl)
const characterBody2 = PIXI.Sprite.from(characterBaseUrl)
const ingameKatshuma = PIXI.Sprite.from(ingameKatshumaUrl)
const ingamemmKALLL = PIXI.Sprite.from(ingamemmKALLLUrl)

ingameKatshuma.anchor.set(0.5)
ingameKatshuma.width = 40
ingameKatshuma.height = 40
ingameKatshuma.x = 50
ingameKatshuma.y = 25

ingamemmKALLL.anchor.set(0.5)
ingamemmKALLL.width = 40
ingamemmKALLL.height = 40
ingamemmKALLL.x = 50
ingamemmKALLL.y = 25

const container1 = new PIXI.Container()
const container2 = new PIXI.Container()

container1.pivot.set(0.5)
container2.pivot.set(0.5)

container1.addChild(characterBody1)
container1.addChild(ingameKatshuma)
container2.addChild(characterBody2)
container2.addChild(ingamemmKALLL)

// Gameplay features
const hurtboxes = new PIXI.Graphics()
hurtboxes.alpha = 0.5
const hitboxes = new PIXI.Graphics()
hitboxes.alpha = 0.5

const healthBarLeftBackground = new PIXI.Graphics()
const healthBarRightBackground = new PIXI.Graphics()
const healthBarLeft = new PIXI.Graphics()
const healthBarRight = new PIXI.Graphics()
const meterLeft = new PIXI.Graphics()
const meterRight = new PIXI.Graphics()

healthBarLeftBackground.beginFill(0xFF0000)
healthBarLeftBackground.drawRect(windowWidth * 0.06, 26, windowWidth * 0.4, 20)
healthBarLeftBackground.endFill()
healthBarRightBackground.beginFill(0xFF0000)
healthBarRightBackground.drawRect(windowWidth / 2 + windowWidth * 0.04, 26, windowWidth * 0.4, 20)
healthBarRightBackground.endFill()
healthBarLeft.beginFill(0x00FF00)
healthBarLeft.drawRect(windowWidth * 0.06, 26, windowWidth * 0.4, 20)
healthBarLeft.endFill()
healthBarRight.beginFill(0x00FF00)
healthBarRight.drawRect(windowWidth / 2 + windowWidth * 0.04, 26, windowWidth * 0.4, 20)
healthBarRight.endFill()

// Backgrounds
var backgroundUrl = require('./assets/sprites/ingame-6.jpg')

const background1 = PIXI.Sprite.from(backgroundUrl) // 2730 (width of original image) / 2.275 = 1200

const backgroundOriginalWidth = 2730 // background1 width is currently hardcoded to be 2730
const backgroundOriginalHeight = 1536 // background1 height is currently hardcoded to be 1536

// Game ending

const winnerText = new PIXI.Text('Game over!', titleTextStyle)
winnerText.anchor.set(0.5)
winnerText.x = middleX
winnerText.y = middleY

// Gamestate transitions
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
    app.stage.addChild(instructionsLeft)
    app.stage.addChild(instructionsRight)
}

function transitionToIngame(): void {
    app.stage.removeChildren()
    app.stage.addChild(background1)
    app.stage.addChild(container1)
    app.stage.addChild(container2)
    app.stage.addChild(hurtboxes)
    app.stage.addChild(hitboxes)
    app.stage.addChild(healthBarLeftBackground)
    app.stage.addChild(healthBarLeft)
    app.stage.addChild(meterLeft)
    app.stage.addChild(healthBarRightBackground)
    app.stage.addChild(healthBarRight)
    app.stage.addChild(meterRight)
}

let previousScreen = 'title-screen'
let hover = 0
let fade = 0
titleEsa.x = 20

let player1facing = 'right'
let player2facing = 'right'

export function render(state: GameState): void {
    if (state.screen === 'title-screen') {
        if (previousScreen != 'title-screen') {
            previousScreen = 'title-screen'
            transitionToTitleScreen()
        }
        titleBeam1.rotation += 0.005
        titleBeam2.rotation += 0.005
        titleBeam3.rotation += 0.005
        titleEsa.y = Math.sin(hover) * 40 + 60
        hover += 0.0225
        titleEsa.alpha = (Math.sin(fade) + 1.2) / 2.2
        fade += 0.025
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

        if (state.players[0].facing != player1facing) {
            ingameKatshuma.scale.x *= -1
            player1facing = state.players[0].facing
        }
        if (state.players[1].facing != player2facing) {
            ingamemmKALLL.scale.x *= -1
            player2facing = state.players[1].facing
        }

        // Camera
        let cameraLeft = state.players[0].x < state.players[1].x ? state.players[0].x - 300 : state.players[1].x - 300
        let cameraRight = state.players[0].x > state.players[1].x ? state.players[0].x + 300 : state.players[1].x + 300
        cameraLeft = cameraLeft < 0 ? 0 : cameraLeft
        cameraRight = cameraRight > 1200 ? 1200 : cameraRight
        let currentMaxCharacterHeight = Math.max(600 - state.players[0].y, 600 - state.players[1].y)
        if (currentMaxCharacterHeight > 0) {
            cameraLeft -= currentMaxCharacterHeight / 2
            cameraRight += currentMaxCharacterHeight / 2
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
                if (isHitboxActive(hitbox)) {
                    if (hitbox.movesWithCharacter) {
                        if (attack.playerSlot === 0) {
                            hitboxes.drawCircle(
                                container1.x + (50 * playerScale) + (hitbox.x * attack.xDirection * playerScale),
                                container1.y + (50 * playerScale) + (hitbox.y * playerScale),
                                hitbox.radius * playerScale
                            )
                        } else if (attack.playerSlot === 1) {
                            hitboxes.drawCircle(
                                container2.x + (50 * playerScale) + (hitbox.x * attack.xDirection * playerScale),
                                container2.y + (50 * playerScale) + (hitbox.y * playerScale),
                                hitbox.radius * playerScale
                            )
                        } else {
                            console.log('Rendering hitboxes is not implemented for more than 2 players')
                        }
                    } else {
                        hitboxes.drawCircle(
                            ((hitbox.x * attack.xDirection - cameraLeft) * pixelScale) - (50 * playerScale),
                            ((hitbox.y - (675 - (675 * windowHeight / background1.height))) / (675 * windowHeight / background1.height) * windowHeight) - (50 * playerScale),
                            hitbox.radius * playerScale
                        )
                    }
                }
            })
        })
        hitboxes.endFill()

        // Health
        healthBarLeft.clear()
        healthBarLeft.beginFill(0x00FF00)

        let player1healthRemaining = state.players[0].health / state.players[0].character.maxHealth
        let player2healthRemaining = state.players[1].health / state.players[1].character.maxHealth
        healthBarLeft.drawRect((windowWidth * 0.06) + (windowWidth * 0.4 * (1 - player1healthRemaining)), 26, windowWidth * 0.4 * player1healthRemaining, 20)
        healthBarLeft.endFill()
        healthBarRight.clear()
        healthBarRight.beginFill(0x00FF00)
        healthBarRight.drawRect((windowWidth / 2 + windowWidth * 0.04) + (windowWidth * 0.4 * (1 - player2healthRemaining)), 26, windowWidth * 0.4 * player2healthRemaining, 20)
        healthBarRight.endFill()
    }
    if (state.screen === 'game-over') {
        if (previousScreen != 'game-over') {
            previousScreen = 'game-over'
            if (state.winner != undefined) {
                if (state.winner === 0) {
                    winnerText.text = 'Winner: Katshuma'
                } else {
                    winnerText.text = 'Winner: mmKALLL'
                }
            } else {
                winnerText.text = 'Game over!'
            }
            app.stage.addChild(winnerText)
        }
    }
}
