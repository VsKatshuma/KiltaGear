import * as PIXI from 'pixi.js'
import { sprites } from './assets'
import { characters } from './kiltagear'
import { GameState } from './types'
import { isHitboxActive, isAttackRelativeToPlayer } from './utilities'

var type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas'
}

const app = new PIXI.Application({backgroundColor: 0x7799FF, width: 1200, height: 675, autoDensity: true, resizeTo: window})
const windowWidth = window.innerWidth
const windowHeight = window.innerHeight

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'

document.body.appendChild(app.view)

const middleX = app.renderer.width / 2
const middleY = app.renderer.height / 2

class Particle {
    x: number
    y: number
    xSpeed: number
    ySpeed: number
    xAcceleration: number
    yAcceleration: number

    constructor(x: number, y: number, xSpeed: number, ySpeed: number, xAcceleration: number, yAcceleration: number) {
      this.x = x
      this.y = y
      this.xSpeed = xSpeed
      this.ySpeed = ySpeed
      this.xAcceleration = xAcceleration
      this.yAcceleration = yAcceleration
    }

    update() {
        this.xSpeed += this.xAcceleration
        this.x += this.xSpeed
        this.ySpeed += this.yAcceleration
        this.y += this.ySpeed
    }
}



/*
 * Rendering variables
 */
const titleBeam1 = PIXI.Sprite.from(sprites.titleBeam1)
const titleBeam2 = PIXI.Sprite.from(sprites.titleBeam2)
const titleBeam3 = PIXI.Sprite.from(sprites.titleBeam3)
const titleEsa = PIXI.Sprite.from(sprites.titleHover)
const titleContainer = new PIXI.Container()

const characterGrid = new PIXI.Container()
const playerTrails: PIXI.Point[][] = [[], [], [], []]
const trailLength: number = 40
const playerSelectors: PIXI.Container[] = []
const highlightArray: PIXI.Container[] = []
const maskArray: PIXI.Sprite[] = []
var characterSelectionSize = Math.min(app.renderer.width / 4.1, app.renderer.height / 3)
const characterSelections = new PIXI.Container() // Entire bottom part of character selection screen
const characterSelection1 = new PIXI.Container()
const characterSelection2 = new PIXI.Container()
const characterSelection3 = new PIXI.Container()
const characterSelection4 = new PIXI.Container()
const characterSelectionImages1: PIXI.Sprite[] = []
const characterSelectionImages2: PIXI.Sprite[] = []
const characterSelectionImages3: PIXI.Sprite[] = []
const characterSelectionImages4: PIXI.Sprite[] = []
const readyIndicator: PIXI.Sprite[] = []
const readyTransitionIn: number[] = [0, 0, 0, 0]
const readyTransitionOut: number[] = [0, 0, 0, 0]
const characterNames: PIXI.Text[] = []
const characterSelectionBackgroundVertical = new PIXI.Graphics()
const characterSelectionBackgroundHorizontal = new PIXI.Graphics()
const characterAnimation1 = new PIXI.Container() // In the transition from character selection to in-game
const characterAnimation2 = new PIXI.Container()
const characterAnimation3 = new PIXI.Container()
const characterAnimation4 = new PIXI.Container()
const characterAnimationImages1: PIXI.Sprite[] = []
const characterAnimationImages2: PIXI.Sprite[] = []
const characterAnimationImages3: PIXI.Sprite[] = []
const characterAnimationImages4: PIXI.Sprite[] = []
const animationNames: PIXI.Text[] = []
const animationBackground = new PIXI.Container()
const animationFlash = new PIXI.Graphics()
var animationBackgroundCoordinates: Particle[] = []

// Containers are the "characters", they group the character body and in-game sprite
const containers: PIXI.Container[] = [new PIXI.Container(), new PIXI.Container(), new PIXI.Container(), new PIXI.Container()]
const maxPlayers: number = 4
const characterBodies: PIXI.Sprite[] = []
const characterSprites: PIXI.Sprite[][] = [[], [], [], []]
const hurtboxes = new PIXI.Graphics()
const hitboxes = new PIXI.Graphics()
hurtboxes.alpha = 0.5
hitboxes.alpha = 0.5
const healthBarLeftBackground = new PIXI.Graphics()
const healthBarRightBackground = new PIXI.Graphics()
const healthBarLeft = new PIXI.Graphics()
const healthBarRight = new PIXI.Graphics()
const meters = new PIXI.Container()
const meterBackgrounds: PIXI.Graphics[] = [new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics()]
const meterForegrounds: PIXI.Graphics[] = [new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics(), new PIXI.Graphics()]
const winnerText = new PIXI.Text('Game over!', new PIXI.TextStyle({ // Temporarily using title text style
    fontFamily: 'Arial', fontSize: 108, fontWeight: 'bold',
    fill: ['#FF0000', '#FFFFFF', '#FFFF00'], stroke: '#000000',
    strokeThickness: 4, dropShadow: true, dropShadowColor: '#000000'
}))

// Backgrounds
var backgroundUrl = require('./assets/sprites/stages/ingame-6.jpg') // TODO: Use the filename in state.stage.image
const background1 = PIXI.Sprite.from(backgroundUrl) // 2730 (width of original image) / 2.275 = 1200

// TODO: Use the width and height from state.stage
const backgroundOriginalWidth = 2730 // background1 image width is hardcoded here to be 2730
const backgroundOriginalHeight = 1536 // background1 image height is hardcoded here to be 1536



/*
 * Graphics initialization
 */
export function initialize(): void {
    /*
     * Title screen
     */

    titleBeam1.anchor.set(0.5, 0.5)
    titleBeam2.anchor.set(0.5, 0.5)
    titleBeam3.anchor.set(0.5, 0.5)

    var titleTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial', fontSize: 108, fontWeight: 'bold',
        fill: ['#FF0000', '#FFFFFF', '#FFFF00'], stroke: '#000000',
        strokeThickness: 4, dropShadow: true, dropShadowColor: '#000000'
    })

    var pressAnyKeyTextStyle = new PIXI.TextStyle({
        fontSize: 30
    })

    const titleText = new PIXI.Text('KiltaGear', titleTextStyle)
    titleText.anchor.set(0.5)
    const versionNumber = new PIXI.Text('v0.6', new PIXI.TextStyle({fontSize: 22}))
    versionNumber.x = 195
    versionNumber.y = 45
    const pressAnyKeyText = new PIXI.Text('Press any key to continue', pressAnyKeyTextStyle)
    pressAnyKeyText.anchor.set(0.5)
    pressAnyKeyText.y = 190

    titleBeam1.x, titleBeam2.x, titleBeam3.x = middleX
    titleBeam1.y, titleBeam2.y, titleBeam3.y = middleY
    titleContainer.addChild(titleText, versionNumber, pressAnyKeyText)
    titleContainer.x = middleX
    titleContainer.y = middleY

    /*
     * Character select
     */

    // Create character grid icons
    const characterGridKatshuma = PIXI.Sprite.from(sprites.KatshumaSmall)
    const characterGridmmKALLL = PIXI.Sprite.from(sprites.mmKALLLSmall)
    const characterGridTruemmKALLL = PIXI.Sprite.from(sprites.TruemmKALLLSmall)
    const characterGridArray: PIXI.Sprite[] = [
        characterGridKatshuma,
        characterGridmmKALLL,
        characterGridTruemmKALLL
    ]

    // Create masks for icons for use with character selection highlights
    const characterGridMask1 = PIXI.Sprite.from(sprites.KatshumaSmall)
    const characterGridMask2 = PIXI.Sprite.from(sprites.mmKALLLSmall)
    const characterGridMask3 = PIXI.Sprite.from(sprites.TruemmKALLLSmall)
    maskArray.push(characterGridMask1)
    maskArray.push(characterGridMask2)
    maskArray.push(characterGridMask3)

    // Resize character grid icons
    for (var i = 0; i < characters.length; i++) {
        characterGridArray[i].width = 80
        characterGridArray[i].height = 80
        maskArray[i].width = 80
        maskArray[i].height = 80
    }

    // Add character grid icons and masks to the top level container
    const characterGridMasks = new PIXI.Container()
    for (var i = 0; i < characters.length; i++) {
        characterGrid.addChild(characterGridArray[i])
        characterGridMasks.addChild(maskArray[i])
    }
    characterGrid.addChild(characterGridMasks)

    // Prevent character grid icons from overlapping
    for (var i = 0; i < characters.length; i++) {
        characterGrid.children[i].x = i * 80
        characterGridMasks.children[i].x = i * 80
    }
    characterGrid.x = middleX - (characterGrid.width / 2)
    characterGrid.y = middleY / 2

    // Initialize character selection images for all 4 players
    characterSelectionImages1.push(PIXI.Sprite.from(sprites.Katshuma))
    characterSelectionImages2.push(PIXI.Sprite.from(sprites.Katshuma))
    characterSelectionImages3.push(PIXI.Sprite.from(sprites.Katshuma))
    characterSelectionImages4.push(PIXI.Sprite.from(sprites.Katshuma))
    characterSelectionImages1.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterSelectionImages2.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterSelectionImages3.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterSelectionImages4.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterSelectionImages1.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    characterSelectionImages2.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    characterSelectionImages3.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    characterSelectionImages4.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    // Resize character selection images
    for (var i = 0; i < characters.length; i++) {
        characterSelectionImages1[i].width = characterSelectionSize
        characterSelectionImages1[i].height = characterSelectionSize
        characterSelectionImages2[i].width = characterSelectionSize
        characterSelectionImages2[i].height = characterSelectionSize
        characterSelectionImages3[i].width = characterSelectionSize
        characterSelectionImages3[i].height = characterSelectionSize
        characterSelectionImages4[i].width = characterSelectionSize
        characterSelectionImages4[i].height = characterSelectionSize
        // TODO: Remove these when the game supports 4 players
        characterSelectionImages1[i].visible = false
        characterSelectionImages4[i].visible = false
    }

    // Initialize character animation images for all 4 players
    characterAnimationImages1.push(PIXI.Sprite.from(sprites.Katshuma))
    characterAnimationImages2.push(PIXI.Sprite.from(sprites.Katshuma))
    characterAnimationImages3.push(PIXI.Sprite.from(sprites.Katshuma))
    characterAnimationImages4.push(PIXI.Sprite.from(sprites.Katshuma))
    characterAnimationImages1.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterAnimationImages2.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterAnimationImages3.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterAnimationImages4.push(PIXI.Sprite.from(sprites.mmKALLL))
    characterAnimationImages1.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    characterAnimationImages2.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    characterAnimationImages3.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    characterAnimationImages4.push(PIXI.Sprite.from(sprites.TruemmKALLL))
    // Resize character animation images
    for (var i = 0; i < characters.length; i++) {
        characterAnimationImages1[i].width = characterSelectionSize
        characterAnimationImages1[i].height = characterSelectionSize
        characterAnimationImages2[i].width = characterSelectionSize
        characterAnimationImages2[i].height = characterSelectionSize
        characterAnimationImages3[i].width = characterSelectionSize
        characterAnimationImages3[i].height = characterSelectionSize
        characterAnimationImages4[i].width = characterSelectionSize
        characterAnimationImages4[i].height = characterSelectionSize
    }
    // Add character animation images to a container
    for (var i = 0; i < characters.length; i++) {
        characterAnimation1.addChild(characterAnimationImages1[i])
        characterAnimation2.addChild(characterAnimationImages2[i])
        characterAnimation3.addChild(characterAnimationImages3[i])
        characterAnimation4.addChild(characterAnimationImages4[i])
    }

    // Initialize player boxes
    for (var i = 0; i < characters.length; i++) {
        characterSelection1.addChild(characterSelectionImages1[i])
        characterSelection2.addChild(characterSelectionImages2[i])
        characterSelection3.addChild(characterSelectionImages3[i])
        characterSelection4.addChild(characterSelectionImages4[i])
    }
    characterSelections.addChild(characterSelection1, characterSelection2, characterSelection3, characterSelection4)

    // Add Ready-indicators to player boxes
    readyIndicator.push(PIXI.Sprite.from(sprites.ready))
    readyIndicator.push(PIXI.Sprite.from(sprites.ready))
    readyIndicator.push(PIXI.Sprite.from(sprites.ready))
    readyIndicator.push(PIXI.Sprite.from(sprites.ready))
    for (var player = 0; player < maxPlayers; player++) {
        readyIndicator[player].anchor.set(0.5, 0.5)
        readyIndicator[player].x = (app.renderer.width / 4 * player) + (app.renderer.width / 4 / 2)
        readyIndicator[player].y = middleY + (characterSelectionSize / 2)
    }
    // Ready-indicators are added to the top-level container in order to draw them on top of other boxes
    characterSelections.addChild(readyIndicator[0], readyIndicator[1], readyIndicator[2], readyIndicator[3])

    // Position player boxes at bottom half of the screen
    characterSelection1.x = app.renderer.width * 0 / 4 + ((app.renderer.width / 4 - characterSelectionSize) / 2)
    characterSelection1.y = middleY
    characterSelection2.x = app.renderer.width * 1 / 4 + ((app.renderer.width / 4 - characterSelectionSize) / 2)
    characterSelection2.y = middleY
    characterSelection3.x = app.renderer.width * 2 / 4 + ((app.renderer.width / 4 - characterSelectionSize) / 2)
    characterSelection3.y = middleY
    characterSelection4.x = app.renderer.width * 3 / 4 + ((app.renderer.width / 4 - characterSelectionSize) / 2)
    characterSelection4.y = middleY

    const characterNameStyle1 = new PIXI.TextStyle({
        fontFamily: 'Arial', fontSize: 36, fontWeight: 'bold',
        fill: ['#FF0000'], stroke: '#000000', strokeThickness: 4,
        dropShadow: true, dropShadowColor: '#000000', dropShadowAngle: 0, dropShadowDistance: 1
    })
    const characterNameStyle2 = new PIXI.TextStyle({
        fontFamily: 'Arial', fontSize: 36, fontWeight: 'bold',
        fill: ['#FF0000'], stroke: '#000000', strokeThickness: 4,
        dropShadow: true, dropShadowColor: '#000000', dropShadowAngle: 0, dropShadowDistance: 1
    })
    const characterNameStyle3 = new PIXI.TextStyle({
        fontFamily: 'Arial', fontSize: 36, fontWeight: 'bold',
        fill: ['#FFFF00'], stroke: '#000000', strokeThickness: 4,
        dropShadow: true, dropShadowColor: '#000000', dropShadowAngle: 0, dropShadowDistance: 1
    })
    const characterNameStyle4 = new PIXI.TextStyle({
        fontFamily: 'Arial', fontSize: 36, fontWeight: 'bold',
        fill: ['#FFFF00'], stroke: '#000000', strokeThickness: 4,
        dropShadow: true, dropShadowColor: '#000000', dropShadowAngle: 0, dropShadowDistance: 1
    })

    characterNames.push(new PIXI.Text('', characterNameStyle1))
    characterNames.push(new PIXI.Text('Katshuma', characterNameStyle2))
    characterNames.push(new PIXI.Text('mmKALLL', characterNameStyle3))
    characterNames.push(new PIXI.Text('', characterNameStyle4))
    //characterName1.anchor.set(0.5)
    //characterName2.anchor.set(0.5)
    characterNames[0].y = characterSelectionSize
    characterNames[1].y = characterSelectionSize
    characterNames[2].y = characterSelectionSize
    characterNames[3].y = characterSelectionSize

    characterSelection2.addChild(characterNames[1])
    characterSelection3.addChild(characterNames[2])

    animationNames.push(new PIXI.Text('', characterNameStyle1))
    animationNames.push(new PIXI.Text('', characterNameStyle2))
    animationNames.push(new PIXI.Text('', characterNameStyle3))
    animationNames.push(new PIXI.Text('', characterNameStyle4))

    const versus = new PIXI.Text("VS.", titleTextStyle)
    versus.anchor.set(0.5, 0.5)
    versus.x = middleX
    versus.y = middleY

    const readyToStartTextStyle = new PIXI.TextStyle({
        fontFamily: 'Consolas',
        fontSize: 24,
        fill: ['#00FF00']
    })
    const readyToStart = new PIXI.Text('Select your characters', readyToStartTextStyle)
    readyToStart.anchor.set(0.5)
    readyToStart.x = middleX
    readyToStart.y = middleY + 230

    const instructionsLeft = new PIXI.Text('Move: WASD\nAttack: C', readyToStartTextStyle)
    const instructionsRight = new PIXI.Text('Move: Arrow keys\nAttack: Comma (,)', readyToStartTextStyle)
    characterSelection1.addChild(instructionsLeft)
    characterSelection4.addChild(instructionsRight)

    // Initialize selector trails
    for (var i = 0; i < trailLength; i++) {
        playerTrails[0].push(new PIXI.Point(0, 0))
        playerTrails[1].push(new PIXI.Point(0, 0))
        playerTrails[2].push(new PIXI.Point(0, 0))
        playerTrails[3].push(new PIXI.Point(0, 0))
    }

    // Create spinning selectors
    const player1Rope = new PIXI.SimpleRope(PIXI.Texture.from(sprites.red), playerTrails[0])
    const player2Rope = new PIXI.SimpleRope(PIXI.Texture.from(sprites.yellow), playerTrails[1])
    const player3Rope = new PIXI.SimpleRope(PIXI.Texture.from(sprites.blue), playerTrails[2])
    const player4Rope = new PIXI.SimpleRope(PIXI.Texture.from(sprites.green), playerTrails[3])
    playerSelectors.push(new PIXI.Container())
    playerSelectors.push(new PIXI.Container())
    playerSelectors.push(new PIXI.Container())
    playerSelectors.push(new PIXI.Container())
    playerSelectors[0].addChild(player1Rope)
    playerSelectors[1].addChild(player2Rope)
    playerSelectors[2].addChild(player3Rope)
    playerSelectors[3].addChild(player4Rope)
    characterGrid.addChild(playerSelectors[0], playerSelectors[1], playerSelectors[2], playerSelectors[3])

    // Create character selection highlights
    const player1Highlight = new PIXI.Graphics()
    player1Highlight.beginFill(0xFF0000)
    player1Highlight.drawRect(0, 0, 60, 114)
    player1Highlight.endFill()
    player1Highlight.x = -60 * Math.sqrt(2)
    player1Highlight.y = 60 * Math.sqrt(2)
    player1Highlight.angle = -45

    const player2Highlight = new PIXI.Graphics()
    player2Highlight.beginFill(0xFFFF00)
    player2Highlight.drawRect(0, 0, 60, 114)
    player2Highlight.endFill()
    player2Highlight.x = -30 * Math.sqrt(2)
    player2Highlight.y = 30 * Math.sqrt(2)
    player2Highlight.angle = -45

    const player3Highlight = new PIXI.Graphics()
    player3Highlight.beginFill(0x0000FF)
    player3Highlight.drawRect(0, 0, 60, 114)
    player3Highlight.endFill()
    player3Highlight.x = 0
    player3Highlight.y = 0
    player3Highlight.angle = -45

    const player4Highlight = new PIXI.Graphics()
    player4Highlight.beginFill(0x00FF00)
    player4Highlight.drawRect(0, 0, 60, 114)
    player4Highlight.endFill()
    player4Highlight.x = 30 * Math.sqrt(2)
    player4Highlight.y = -30 * Math.sqrt(2)
    player4Highlight.angle = -45

    const highlightPosition1 = new PIXI.Container()
    const highlightPosition2 = new PIXI.Container()
    const highlightPosition3 = new PIXI.Container()
    const highlightPosition4 = new PIXI.Container()
    highlightPosition1.addChild(player1Highlight)
    highlightPosition2.addChild(player2Highlight)
    highlightPosition3.addChild(player3Highlight)
    highlightPosition4.addChild(player4Highlight)
    highlightArray.push(highlightPosition1)
    highlightArray.push(highlightPosition2)
    highlightArray.push(highlightPosition3)
    highlightArray.push(highlightPosition4)
    characterGrid.addChild(highlightPosition1, highlightPosition2, highlightPosition3, highlightPosition4)

    /*const selectionBox = new PIXI.Graphics()
    selectionBox.lineStyle(4, 0xFFFF00, 1)
    selectionBox.moveTo(0, 0)
    selectionBox.lineTo(64, 0)
    selectionBox.lineTo(64, 64)
    selectionBox.lineTo(0, 64)
    selectionBox.lineTo(0, 0)
    selectionBox.pivot.set(32, 32)
    //selectionBox.x = middleX + (characterSelectionColumns / 2) * 64
    selectionBox.y = middleY
    //app.stage.addChild(selectionBox)*/

    // Initialize character selection screen background
    characterSelectionBackgroundVertical.lineStyle(4, 0x000000, 0.65)
    for (var x = -64; x < app.renderer.width; x += 64) {
        characterSelectionBackgroundVertical.moveTo(x, 0)
        characterSelectionBackgroundVertical.lineTo(x, app.renderer.height)
    }
    characterSelectionBackgroundHorizontal.lineStyle(4, 0x000000, 0.65)
    for (var y = -64; y < app.renderer.height; y += 64) {
        characterSelectionBackgroundHorizontal.moveTo(0, y)
        characterSelectionBackgroundHorizontal.lineTo(app.renderer.width, y)
    }

    /*
     * In-game characters
     */

    characterBodies.push(PIXI.Sprite.from(sprites.characterBase))
    characterBodies.push(PIXI.Sprite.from(sprites.characterBase))
    characterBodies.push(PIXI.Sprite.from(sprites.characterBase))
    characterBodies.push(PIXI.Sprite.from(sprites.characterBase))
    const ingameKatshuma1 = PIXI.Sprite.from(sprites.KatshumaSmall)
    const ingameKatshuma2 = PIXI.Sprite.from(sprites.KatshumaSmall)
    const ingameKatshuma3 = PIXI.Sprite.from(sprites.KatshumaSmall)
    const ingameKatshuma4 = PIXI.Sprite.from(sprites.KatshumaSmall)
    const ingamemmKALLL1 = PIXI.Sprite.from(sprites.mmKALLLSmall)
    const ingamemmKALLL2 = PIXI.Sprite.from(sprites.mmKALLLSmall)
    const ingamemmKALLL3 = PIXI.Sprite.from(sprites.mmKALLLSmall)
    const ingamemmKALLL4 = PIXI.Sprite.from(sprites.mmKALLLSmall)
    const ingameTruemmKALLL1 = PIXI.Sprite.from(sprites.TruemmKALLLSmall)
    const ingameTruemmKALLL2 = PIXI.Sprite.from(sprites.TruemmKALLLSmall)
    const ingameTruemmKALLL3 = PIXI.Sprite.from(sprites.TruemmKALLLSmall)
    const ingameTruemmKALLL4 = PIXI.Sprite.from(sprites.TruemmKALLLSmall)
    
    characterSprites[0] = [ingameKatshuma1, ingamemmKALLL1, ingameTruemmKALLL1]
    characterSprites[1] = [ingameKatshuma2, ingamemmKALLL2, ingameTruemmKALLL2]
    characterSprites[2] = [ingameKatshuma3, ingamemmKALLL3, ingameTruemmKALLL3]
    characterSprites[3] = [ingameKatshuma4, ingamemmKALLL4, ingameTruemmKALLL4]

    // Initialize character sprite attributes
    for (var player = 0; player < maxPlayers; player++) {
        for (var i = 0; i < characters.length; i++) {
            characterSprites[player][i].anchor.set(0.5)
            characterSprites[player][i].width = 40
            characterSprites[player][i].height = 40
            characterSprites[player][i].x = 50
            characterSprites[player][i].y = 25
        }
    }

    // Spin characters around their center
    containers[0].pivot.set(50)
    containers[1].pivot.set(50)
    containers[2].pivot.set(50)
    containers[3].pivot.set(50)

    /*
     * Gameplay features
     */

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

    for (var player = 0; player < maxPlayers; player++) {
        meters.addChild(meterBackgrounds[player])
        meters.addChild(meterForegrounds[player])
    }

    // Results
    winnerText.anchor.set(0.5)
    winnerText.x = middleX
    winnerText.y = middleY
}

function resetTrails(): void {
    for (var i = 0; i < trailLength; i++) {
        playerTrails[0][i].x = 0
        playerTrails[0][i].y = i * 4
        playerTrails[1][i].x = 80
        playerTrails[1][i].y = 80 - (i * 4)
    }
}

function transitionToTitleScreen(): void {
    animationCycle = 0
    animationFade = 0
    app.renderer.backgroundColor = 0x7799FF
    app.stage.removeChildren()
    app.stage.addChild(titleBeam1, titleBeam2, titleBeam3, titleEsa, titleContainer)
}

function transitionToCharacterSelect(player1: number, player2: number): void {
    animationCycle = 0
    trailFrame = 0
    player1Selection = player1
    player2Selection = player2
    animationBegun = false
    animationDuration = 0
    resetTrails()
    // TODO: Turn these into a function
    for (var i = 0; i < characters.length; i++) {
        if (i == player1Selection) {
            characterSelectionImages2[i].visible = true
        } else {
            characterSelectionImages2[i].visible = false
        }
    }
    for (var i = 0; i < characters.length; i++) {
        if (i == player2Selection) {
            characterSelectionImages3[i].visible = true
        } else {
            characterSelectionImages3[i].visible = false
        }
    }
    playerSelectors[0].x = 80 * player1Selection
    playerSelectors[1].x = 80 * player2Selection
    highlightArray[0].x = 80 * player1Selection
    highlightArray[0].getChildAt(0).mask = maskArray[player1Selection]
    highlightArray[1].x = 80 * player2Selection
    highlightArray[1].getChildAt(0).mask = maskArray[player2Selection]
    for (var player = 0; player < maxPlayers; player++) {
        readyIndicator[player].visible = false
        highlightArray[player].visible = false
    }

    app.renderer.backgroundColor = 0x3300AA
    app.stage.removeChildren()
    app.stage.addChild(characterSelectionBackgroundVertical, characterSelectionBackgroundHorizontal)
    app.stage.addChild(characterGrid)
    app.stage.addChild(characterSelections)
    //app.stage.addChild(versus, readyToStart)
}

function transitionToIngame(characterSelection: number[]): void {
    // Reset and build in-game characters
    for (var player = 0; player < maxPlayers; player++) {
        containers[player].removeChildren()
        containers[player].addChild(characterBodies[player], characterSprites[player][characterSelection[player]])
    }

    app.stage.removeChildren()
    app.stage.addChild(background1, containers[1], containers[2])
    app.stage.addChild(hurtboxes, hitboxes)
    app.stage.addChild(healthBarLeftBackground, healthBarLeft)
    app.stage.addChild(healthBarRightBackground, healthBarRight)
    app.stage.addChild(meters)
}

let previousScreen = ''
titleEsa.x = 20
titleEsa.y = 60
let animationCycle: number = 0
let animationFade: number = 0
let trailFrame: number = 0
let player1Selection = 0
let player2Selection = 0
let animationBegun: boolean = false
let animationDuration: number = 0

export function allowTransitionToIngame(): boolean {
    return animationBegun && animationDuration > 320
}

export function render(state: GameState): void {
    if (state.screen === 'title-screen') {
        if (previousScreen != 'title-screen') {
            previousScreen = 'title-screen'
            transitionToTitleScreen()
        }
        titleBeam1.rotation += 0.005
        titleBeam2.rotation += 0.005
        titleBeam3.rotation += 0.005
        titleEsa.y = Math.sin(animationCycle) * 40 + 60
        animationCycle += 0.0225
        titleEsa.alpha = (Math.sin(animationFade) + 1.2) / 2.2
        animationFade += 0.025
    }
    if (state.screen === 'character-select') {
        if (previousScreen != 'character-select') {
            previousScreen = 'character-select'
            transitionToCharacterSelect(state.characterSelection[0], state.characterSelection[1])

            // TODO: Fix these when the game supports 4 players
            playerSelectors[2].visible = false
            playerSelectors[3].visible = false
        }

        if (!state.start) {
            // Animate character selectors
            /*for (var player = 0; player < maxPlayers; player++) {
                playerTrails[player].pop()
            }*/
            playerTrails[0].pop()
            playerTrails[1].pop()
            if (trailFrame % 80 < 20) {
                playerTrails[0].unshift(new PIXI.Point(playerTrails[0][0].x + 4, playerTrails[0][0].y));
                playerTrails[1].unshift(new PIXI.Point(playerTrails[1][0].x - 4, playerTrails[1][0].y));
            } else if (trailFrame % 80 < 40) {
                playerTrails[0].unshift(new PIXI.Point(playerTrails[0][0].x, playerTrails[0][0].y + 4));
                playerTrails[1].unshift(new PIXI.Point(playerTrails[1][0].x, playerTrails[1][0].y - 4));
            } else if (trailFrame % 80 < 60) {
                playerTrails[0].unshift(new PIXI.Point(playerTrails[0][0].x - 4, playerTrails[0][0].y));
                playerTrails[1].unshift(new PIXI.Point(playerTrails[1][0].x + 4, playerTrails[1][0].y));
            } else {
                playerTrails[0].unshift(new PIXI.Point(playerTrails[0][0].x, playerTrails[0][0].y - 4));
                playerTrails[1].unshift(new PIXI.Point(playerTrails[1][0].x, playerTrails[1][0].y + 4));
            }
            trailFrame++

            // Move character selectors in the grid
            for (var player = 0; player < maxPlayers; player++) {
                if (playerSelectors[player].x < 80 * state.characterSelection[player]) {
                    playerSelectors[player].x += 4
                } else if (playerSelectors[player].x > 80 * state.characterSelection[player]) {
                    playerSelectors[player].x -= 4
                }
            }

            // Animate player highlights
            for (var player = 0; player < maxPlayers; player++) {
                let highlight = highlightArray[player].getChildAt(0)
                highlight.x += 4 * Math.sqrt(2)
                highlight.y -= 4 * Math.sqrt(2)
                if (highlight.x > 60 * Math.sqrt(2)) {
                    highlight.x -= 120 * Math.sqrt(2)
                    highlight.y += 120 * Math.sqrt(2)
                }
            }

            // Player 1 changed character selection ("event")
            if (player1Selection != state.characterSelection[0]) {
                player1Selection = state.characterSelection[0]

                // Move player highlight and set mask
                highlightArray[0].x = 80 * player1Selection
                highlightArray[0].getChildAt(0).mask = maskArray[player1Selection]
                for (var i = 0; i < characters.length; i++) {
                    if (i == player1Selection) {
                        characterSelectionImages2[i].visible = true
                    } else {
                        characterSelectionImages2[i].visible = false
                    }
                }
                characterNames[1].text = characters[player1Selection].name
            }
            // Player 2 changed character selection ("event")
            if (player2Selection != state.characterSelection[1]) {
                player2Selection = state.characterSelection[1]

                // Move player highlight and set mask
                highlightArray[1].x = 80 * player2Selection
                highlightArray[1].getChildAt(0).mask = maskArray[player2Selection]
                for (var i = 0; i < characters.length; i++) {
                    if (i == player2Selection) {
                        characterSelectionImages3[i].visible = true
                    } else {
                        characterSelectionImages3[i].visible = false
                    }
                }
                characterNames[2].text = characters[player2Selection].name
            }

            // Toggle player highlight and Ready-indicator visibility
            switch (state.playerReady[0]) {
                case true:
                    highlightArray[0].visible = true
                    readyIndicator[1].visible = true
                    if (readyTransitionIn[1] > 0) {
                        readyIndicator[1].scale.set(readyTransitionIn[1])
                        readyIndicator[1].zIndex = 1
                        characterSelections.sortChildren()
                    } else {
                        readyIndicator[1].scale.set(Math.max(Math.sin(animationCycle) * 1.2, 1))
                        readyIndicator[1].zIndex = 0
                        characterSelections.sortChildren()
                    }
                    readyTransitionIn[1] = Math.max(readyTransitionIn[1] - 1, 0)
                    break
                case false:
                    highlightArray[0].visible = false
                    readyIndicator[1].visible = false
                    readyTransitionIn[1] = 20
                    break
            }
            switch (state.playerReady[1]) {
                case true:
                    highlightArray[1].visible = true
                    readyIndicator[2].visible = true
                    readyIndicator[2].alpha = 1
                    if (readyTransitionIn[2] > 0) {
                        readyIndicator[2].scale.set(readyTransitionIn[2])
                        readyIndicator[2].zIndex = 1
                        characterSelections.sortChildren()
                    } else {
                        readyIndicator[2].scale.set(Math.max(Math.sin(animationCycle) * 1.2, 1))
                        readyIndicator[2].zIndex = 0
                        characterSelections.sortChildren()
                    }
                    readyTransitionIn[2] = Math.max(readyTransitionIn[2] - 1, 0)
                    break
                case false:
                    highlightArray[1].visible = false
                    readyIndicator[2].visible = false
                    readyTransitionIn[2] = 20
                    break
            }
            animationCycle += 0.25

            characterSelectionBackgroundVertical.x = (characterSelectionBackgroundVertical.x) % 64
            characterSelectionBackgroundHorizontal.y = (characterSelectionBackgroundHorizontal.y + 1) % 64
        } else {
            // Begin transition from character selection state to in-game
            if (!animationBegun) {
                animationBackground.removeChildren()
                animationBackgroundCoordinates = []

                // TODO: Fix this when the game supports 4 players
                for (var i = 0; i < characters.length; i++) {
                    characterAnimationImages1[i].visible = false
                    if (player1Selection == i) {
                        characterAnimationImages2[i].visible = true
                    } else {
                        characterAnimationImages2[i].visible = false
                    }
                    if (player2Selection == i) {
                        characterAnimationImages3[i].visible = true
                    } else {
                        characterAnimationImages3[i].visible = false
                    }
                    characterAnimationImages4[i].visible = false
                }
                characterAnimation2.x = characterSelection2.x
                characterAnimation2.y = characterSelection2.y
                characterAnimation3.x = characterSelection3.x
                characterAnimation3.y = characterSelection3.y

                for (var player = 0; player < maxPlayers; player++) {
                    animationNames[player].text = ''
                }

                app.renderer.backgroundColor = 0x000000
                app.stage.removeChildren()
                app.stage.addChild(animationBackground)
                app.stage.addChild(
                    characterAnimation1, characterAnimation2, characterAnimation3, characterAnimation4,
                    animationNames[0], animationNames[1], animationNames[2], animationNames[3]
                )
                app.stage.addChild(animationFlash)
                animationBegun = true
            }

            // Animate transition
            let destinationX1 = middleX / 2 - (characterSelectionSize / 2)
            let destinationY1 = middleY - (characterSelectionSize / 2)
            let destinationX2 = middleX + (middleX / 2) - (characterSelectionSize / 2)
            let destinationY2 = middleY - (characterSelectionSize / 2)
            characterAnimation2.x += (destinationX1 - characterAnimation2.x) * 0.05
            characterAnimation2.y += (destinationY1 - characterAnimation2.y) * 0.05
            characterAnimation3.x += (destinationX2 - characterAnimation3.x) * 0.05
            characterAnimation3.y += (destinationY2 - characterAnimation3.y) * 0.05

            if (animationDuration == 112) {
                animationFlash.beginFill(0xFFFFFF)
                animationFlash.drawRect(0, 0, windowWidth, windowHeight)
                animationFlash.endFill()
            } else if (animationDuration == 116) {
                animationFlash.clear()
                animationNames[1].text = characters[player1Selection].name
                animationNames[1].x = characterAnimation2.x
                animationNames[1].y = characterAnimation2.y - 70
                animationNames[2].text = characters[player2Selection].name
                animationNames[2].x = characterAnimation3.x + 60
                animationNames[2].y = characterAnimation3.y + characterSelectionSize + 25
            }

            // Add stars
            if (animationDuration >= 112) {
                animationBackground.addChild(new PIXI.Graphics().beginTextureFill({texture: PIXI.Texture.from(sprites.redStar)}).drawStar(0, 0, 4, 10, 3))
                let point = 2 * Math.PI * Math.random() // Random point on unit circle
                animationBackgroundCoordinates.push(new Particle(
                    characterAnimation2.x + (characterSelectionSize / 2),
                    characterAnimation2.y + (characterSelectionSize / 2),
                    Math.cos(point) * 10,
                    Math.sin(point) * 10, 0, 0
                ))
                animationBackground.addChild(new PIXI.Graphics().beginTextureFill({texture: PIXI.Texture.from(sprites.yellowStar)}).drawStar(0, 0, 4, 10, 3))
                point = 2 * Math.PI * Math.random() // Random point on unit circle
                animationBackgroundCoordinates.push(new Particle(
                    characterAnimation3.x + (characterSelectionSize / 2),
                    characterAnimation3.y + (characterSelectionSize / 2),
                    Math.cos(point) * 10,
                    Math.sin(point) * 10, 0, 0
                ))
                for (var i = 0; i < animationBackgroundCoordinates.length; i++) {
                    animationBackgroundCoordinates[i].update()
                    let star = animationBackground.getChildAt(i)
                    star.x = animationBackgroundCoordinates[i].x
                    star.y = animationBackgroundCoordinates[i].y
                }
                animationNames[1].x += 0.5
                animationNames[2].x -= 0.5
            }

            animationDuration++
        }
    }
    if (state.screen === 'in-game') {
        if (previousScreen != 'in-game') {
            previousScreen = 'in-game'
            // TODO: Fix this when the game supports 4 players (The line below simulates 2 extra players)
            transitionToIngame([0, state.characterSelection[0], state.characterSelection[1], 0])
        }
        state.players.forEach(player => {
            // Draw something at (player.x, player.y)
            // Need to implement player sprites in a smart way first
        })

        // Flip player sprite when player turns around
        if (state.players[0].facing == 'left' && Math.sign(containers[1].getChildAt(1).scale.x) == 1) {
            containers[1].getChildAt(1).scale.x *= -1
        } else if (state.players[0].facing == 'right' && Math.sign(containers[1].getChildAt(1).scale.x) == -1) {
            containers[1].getChildAt(1).scale.x *= -1
        }
        if (state.players[1].facing == 'left' && Math.sign(containers[2].getChildAt(1).scale.x) == 1) {
            containers[2].getChildAt(1).scale.x *= -1
        } else if (state.players[1].facing == 'right' && Math.sign(containers[2].getChildAt(1).scale.x) == -1) {
            containers[2].getChildAt(1).scale.x *= -1
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
        containers[1].scale.set(playerScale)
        containers[2].scale.set(playerScale)
        let pixelScale = windowWidth / visibleAreaWidth
        containers[1].x = ((state.players[0].x - cameraLeft) * pixelScale)
        containers[2].x = ((state.players[1].x - cameraLeft) * pixelScale)
        // windowHeight / background1.height kertoo, miten suuri osuus taustakuvan alaosasta on näkyvissä
        containers[1].y = ((state.players[0].y - (675 - (675 * windowHeight / background1.height))) / (675 * windowHeight / background1.height) * windowHeight)
        containers[2].y = ((state.players[1].y - (675 - (675 * windowHeight / background1.height))) / (675 * windowHeight / background1.height) * windowHeight)

        // Player rotation in hitstun
        if (state.players[0].state == 'hitstun') {
            if (state.players[0].facing == 'left') {
                containers[1].angle += 15
            } else {
                containers[1].angle -= 15
            }
        } else {
            containers[1].angle = 0
        }
        if (state.players[1].state == 'hitstun') {
            if (state.players[1].facing == 'left') {
                containers[2].angle += 15
            } else {
                containers[2].angle -= 15
            }
        } else {
            containers[2].angle = 0
        }

        // Draw hurtboxes
        hurtboxes.clear()
        hurtboxes.beginFill(0x6688FF)
        hurtboxes.drawCircle(
            containers[1].x,
            containers[1].y,
            state.players[0].character.hurtboxRadius * playerScale
        )
        hurtboxes.drawCircle(
            containers[2].x,
            containers[2].y,
            state.players[1].character.hurtboxRadius * playerScale
        )
        hurtboxes.endFill()

        // Draw hitboxes
        hitboxes.clear()
        hitboxes.beginFill(0xDD0000)
        state.activeAttacks.forEach(attack => {
            attack.hitboxes.forEach(hitbox => {
                if (isHitboxActive(hitbox)) {
                    if (isAttackRelativeToPlayer(attack)) {
                        if (attack.playerSlot === 0) {
                            hitboxes.drawCircle(
                                containers[1].x + ((attack.x + hitbox.x) * playerScale),
                                containers[1].y + ((attack.y + hitbox.y) * playerScale),
                                hitbox.radius * playerScale
                            )
                        } else if (attack.playerSlot === 1) {
                            hitboxes.drawCircle(
                                containers[2].x + ((attack.x + hitbox.x) * playerScale),
                                containers[2].y + ((attack.y + hitbox.y) * playerScale),
                                hitbox.radius * playerScale
                            )
                        } else {
                            console.log('Rendering hitboxes is not implemented for more than 2 players')
                        }
                    } else { // TODO: Make sure this draws hitboxes in the right place
                        hitboxes.drawCircle(
                            (attack.x + hitbox.x - cameraLeft) * pixelScale,
                            (attack.y + hitbox.y - (675 - (675 * windowHeight / background1.height))) / (675 * windowHeight / background1.height) * windowHeight,
                            hitbox.radius * playerScale
                        )
                    }
                }
            })
        })
        hitboxes.endFill()

        // Health
        let player1HealthRemaining = state.players[0].health / state.players[0].character.maxHealth
        let player2HealthRemaining = state.players[1].health / state.players[1].character.maxHealth

        healthBarLeft.clear()
        healthBarLeft.beginFill(0x00FF00)
        healthBarLeft.drawRect((windowWidth * 0.06) + (windowWidth * 0.4 * (1 - player1HealthRemaining)), 26, windowWidth * 0.4 * player1HealthRemaining, 20)
        healthBarLeft.endFill()

        healthBarRight.clear()
        healthBarRight.beginFill(0x00FF00)
        healthBarRight.drawRect((windowWidth / 2 + windowWidth * 0.04) + (windowWidth * 0.4 * (1 - player2HealthRemaining)), 26, windowWidth * 0.4 * player2HealthRemaining, 20)
        healthBarRight.endFill()

        // Meter
        let player1Meter = state.players[0].meter / state.players[0].character.maxMeter
        let player2Meter = state.players[1].meter / state.players[1].character.maxMeter

        meterBackgrounds[1].clear()
        meterBackgrounds[1].lineStyle(3, 0x000000)
        meterBackgrounds[1].beginFill(0x000099, 0.33)
        meterBackgrounds[1].drawRect(windowWidth * 0.06, windowHeight - 46, windowWidth * 0.4, 20)
        meterBackgrounds[2].clear()
        meterBackgrounds[2].lineStyle(3, 0x000000)
        meterBackgrounds[2].beginFill(0x000099, 0.33)
        meterBackgrounds[2].drawRect(windowWidth / 2 + windowWidth * 0.04, windowHeight - 46, windowWidth * 0.4, 20)
        
        meterForegrounds[1].clear()
        meterForegrounds[1].beginFill(0x0088FF)
        meterForegrounds[1].drawRect((windowWidth * 0.06) + (windowWidth * 0.4 * (1 - player1Meter)), windowHeight - 43, windowWidth * 0.4 * player1Meter, 16)
        meterForegrounds[1].endFill()
        meterForegrounds[2].clear()
        meterForegrounds[2].beginFill(0x0088FF)
        meterForegrounds[2].drawRect((windowWidth / 2 + windowWidth * 0.04) + (windowWidth * 0.4 * (1 - player2Meter)), windowHeight - 43, windowWidth * 0.4 * player2Meter, 16)
        meterForegrounds[2].endFill()

        for (var threshold = 0; threshold < state.players[0].character.meterThresholds.length; threshold++) {
            meterBackgrounds[1].moveTo(windowWidth * 0.06 + (windowWidth * 0.4) * (state.players[0].character.meterThresholds[threshold] / state.players[0].character.maxMeter), windowHeight - 46)
            meterBackgrounds[1].lineTo(windowWidth * 0.06 + (windowWidth * 0.4) * (state.players[0].character.meterThresholds[threshold] / state.players[0].character.maxMeter), windowHeight - 26)
        }
        meterBackgrounds[1].endFill()
        for (var threshold = 0; threshold < state.players[1].character.meterThresholds.length; threshold++) {
            meterBackgrounds[2].moveTo(windowWidth / 2 + windowWidth * 0.04 + (windowWidth * 0.4) * (state.players[1].character.meterThresholds[threshold] / state.players[1].character.maxMeter), windowHeight - 46)
            meterBackgrounds[2].lineTo(windowWidth / 2 + windowWidth * 0.04 + (windowWidth * 0.4) * (state.players[1].character.meterThresholds[threshold] / state.players[1].character.maxMeter), windowHeight - 26)
        }
        meterBackgrounds[2].endFill()
    }
    if (state.screen === 'game-over') {
        if (previousScreen != 'game-over') {
            previousScreen = 'game-over'
            if (state.winner != undefined) {
                winnerText.text = 'Winner: ' + state.winner.character.name
            } else {
                winnerText.text = 'Game over!'
            }
            app.stage.addChild(winnerText)
        }
    }
}
