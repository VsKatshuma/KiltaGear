import { Character, Attack, Player } from "../types";
import { generateAttack, createHitbox, gainMeter, generateProjectile } from "../utilities";

export const mmKALLL: Character = {
    name: 'mmKALLL',
    id: 'mmkalll',
    maxHealth: 100,
    maxMeter: 100,
    startingMeter: 0,
    meterThresholds: [25, 50, 75, 100],
    walkSpeed: 6.5, // Horizontal speed in pixels per frame
    airSpeed: 9,
    weight: 1, // Multiplier relative to mmKALLL
    maxJumps: 2,
    jumpStrength: 1, // Multiplier relative to mmKALLL
    hurtboxRadius: 20, // Sprites are 40x100
    onEachFrame: (player: Player) => player,
    onMove: (player: Player) => gainMeter(0.1, player),
    onJump: (player: Player) => player,
    onAttackHit: (player: Player) => gainMeter(8, player),
    onGetHit: (player: Player) => gainMeter(-5, player),
    attacks: {
        LightNeutral: {
            ...generateAttack([
                { ...createHitbox(4, 3, 3) },
                { ...createHitbox(12, 8, 6) }
            ]),
            duration: 22, // You can override any property of generateAttack by adding it after the ... spread
        },
        LightForward: {
            ...generateAttack([
                { ...createHitbox(20, 10, 13) }
            ]),
            duration: 35,
        },
        LightDown: {
            ...generateAttack([
                { ...createHitbox(9, 6, 5), radius: 10, x: 80 } // Override also works on hitboxes
            ])
        },
        airLightNeutral: {
            ...generateAttack([
                { ...createHitbox(9, 7, 6) },
                { ...createHitbox(45, 15, 11) },
                { ...createHitbox(90, 20, 3), radius: 70 }
            ])
        },
        airLightUp: {
            ...generateAttack([
                { ...createHitbox(11, 20, 14), y: -50 } // Negative y means upwards
            ])
        },
        airLightDown: {
            ...generateAttack([
                { ...createHitbox(30, 20, 22) }
            ])
        },
        airLightForward: {
            ...generateAttack([
                { ...createHitbox(4, 40, 5), radius: 30 }
            ])
        },
        // An attack can also have many hitboxes with different timings
        airLightBack: {
            ...generateAttack([
                { ...createHitbox(4, 10, 6), radius: 15,   x: -10 },
                { ...createHitbox(11, 10, 6), radius: 15,  x: -30 },
                { ...createHitbox(18, 10, 6), radius: 15,  x: -50 },
                { ...createHitbox(25, 10, 6), radius: 15,  x: -70 },
                { ...createHitbox(34, 10, 6), radius: 15,  x: -90 },
                { ...createHitbox(45, 10, 6), radius: 15,  x: -10 },
                { ...createHitbox(51, 10, 6), radius: 15,  x: -30 },
                { ...createHitbox(67, 10, 6), radius: 15,  x: -50 },
                { ...createHitbox(74, 10, 6), radius: 15,  x: -70 },
                { ...createHitbox(80, 10, 6), radius: 15, x: -90 },
                { ...createHitbox(90, 10, 6), radius: 15, x: -10 },
                { ...createHitbox(100, 10, 6), radius: 15, x: -30 },
                { ...createHitbox(110, 10, 6), radius: 15, x: -50 },
                { ...createHitbox(120, 10, 6), radius: 15, x: -70 },
                { ...createHitbox(130, 10, 6), radius: 15, x: -90 },
            ]),
            duration: 40
        },

        // Special and meter moves are assigned below
    }
}

// Create special moves:

export const heal: Attack = {
    ...generateAttack([]),
    duration: 80,
    endWhenHitboxConnects: false,
    endWhenHitboxesEnded: false,
    endAfterDurationEnded: true,
    meterCost: 25,
    onStart: (state, attack) => {
        state.players[attack.playerSlot].hitlagRemaining = 60
        return state
    },
    onEnd: (state, attack) => {
        const player = state.players[attack.playerSlot]
        state.players[attack.playerSlot].health = Math.min(player.health + 10, player.character.maxHealth)
        return state
    }
}

export const hadoken: Attack = {
    ...generateProjectile([
        { ...createHitbox(30, 180, 8) }
    ]),
    onStart: (state, attack) => {
        state.players[attack.playerSlot].hitlagRemaining = 30
        return state
    },
    x: -55,
    meterCost: 10
}

// Assign them:

mmKALLL.attacks = {
    ...mmKALLL.attacks,

    // Special moves
    SpecialNeutral: {
        ...generateAttack([])
    },
    SpecialForward: {
        ...generateAttack([])
    },
    SpecialDown: {
        ...generateAttack([])
    },
    airSpecialNeutral: {
        ...generateAttack([])
    },
    airSpecialUp: {
        ...generateAttack([])
    },
    airSpecialDown: {
        ...generateAttack([])
    },
    airSpecialForward: {
        ...generateAttack([])
    },
    airSpecialBack: {
        ...generateAttack([])
    },

    // Meter moves
    MeterNeutral: heal,
    MeterForward: hadoken,
    MeterDown: heal,
    airMeterNeutral: heal,
    airMeterUp: heal,
    airMeterDown: heal,
    airMeterForward: hadoken,
    airMeterBack: { ...hadoken, xSpeed: -2.5, x: 5 } // TODO: x: 55 would make sense but makes the projectile spawn too much to the right
}
