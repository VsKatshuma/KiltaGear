import * as PIXI from 'pixi.js'

function gradient(from: string, to: string): PIXI.Texture {
    let c = document.createElement("canvas")
    let ctx = c.getContext("2d")
    if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 100, 100)
        gradient.addColorStop(0, from)
        gradient.addColorStop(1, to)
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 100, 100)
        return PIXI.Texture.from(c)
    } else throw "Error in creating gradient"
}

// Example use:
//const star = new PIXI.Graphics().beginTextureFill({texture: gradient('#9ff', '#033')}).drawStar(50, 50, 5, 50, 20)

function radialGradient(red: string, green: string, blue: string): HTMLCanvasElement {
    let canvas = document.createElement("canvas")
    let size = 16
    canvas.width = size
    canvas.height = size
    let context = canvas.getContext("2d")
    if (context) {
        context.rect(0, 0, canvas.width, canvas.height)

        // Create radial gradient
        let gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        gradient.addColorStop(0, 'rgba(' + red + ', ' + green + ', ' + blue + ', 1)')
        gradient.addColorStop(0.4, 'rgba(' + red + ', ' + green + ', ' + blue + ', 0.9)')
        gradient.addColorStop(0.5, 'rgba(' + red + ', ' + green + ', ' + blue + ', 0.8)')
        gradient.addColorStop(0.9, 'rgba(' + red + ', ' + green + ', ' + blue + ', 0.1)')
        gradient.addColorStop(1, 'rgba(' + red + ', ' + green + ', ' + blue + ', 0)')

        context.fillStyle = gradient
        context.fill()
        return canvas
    } else throw "Error in creating radialGradient"
}

export const sprites = {
    titleBeam1: require('./assets/sprites/title-2.png'),
    titleBeam2: require('./assets/sprites/title-3.png'),
    titleBeam3: require('./assets/sprites/title-4.png'),
    titleHover: require('./assets/sprites/title.png'),

    characterBase: require('./assets/sprites/character.png'),
    Katshuma: require('./assets/sprites/character-select-katshuma.jpg'),
    KatshumaSmall: require('./assets/sprites/in-game-katshuma.jpg'),
    mmKALLL: require('./assets/sprites/character-select-mmkalll.jpg'),
    mmKALLLSmall: require('./assets/sprites/in-game-mmkalll.jpg'),
    TruemmKALLL: require('./assets/sprites/character-select-true-mmkalll.jpg'),
    TruemmKALLLSmall: require('./assets/sprites/in-game-true-mmkalll.jpg'),

    red: radialGradient('255', '0', '0'),
    yellow: radialGradient('255', '255', '0'),
    blue: radialGradient('0', '0', '255'),
    green: radialGradient('0', '255', '0'),

    ready: require('./assets/sprites/ready.png'),
    
    redStar: require('./assets/sprites/color-red.png'),
    yellowStar: require('./assets/sprites/color-yellow.png')
}
