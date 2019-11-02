import { Character } from "../types";
import { generateAttack, createHitbox } from "../utilities";


export const mmKALLL: Character = {
    name: 'mmKALLL',
    id: 'mmkalll',
    maxHealth: 100,
    walkSpeed: 5,
    airSpeed: 8,
    weight: 1, // Multiplier relative to mmKALLL
    maxJumps: 2,
    jumpStrength: 1, // Multiplier relative to mmKALLL
    hurtboxRadius: 20, // Sprites are 40x100
    attacks: {
        LightNeutral: {
            ...generateAttack([
                { ...createHitbox(4, 3, 3) },
                { ...createHitbox(12, 8, 6) }
            ]),
            projectile: false, // You can override any property of generateAttack by adding it after the ... spread
        },
        LightForward: {
            ...generateAttack([
                { ...createHitbox(20, 10, 13) }
            ]),
            projectile: false,
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
                { ...createHitbox(11, 20, 14), y: -50 }
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
        // Special and meter attacks can be made, but nothing's special about them yet (2019-11-01)
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
        MeterNeutral: {
            ...generateAttack([])
        },
        MeterForward: {
            ...generateAttack([])
        },
        MeterDown: {
            ...generateAttack([])
        },
        airMeterNeutral: {
            ...generateAttack([])
        },
        airMeterUp: {
            ...generateAttack([])
        },
        airMeterDown: {
            ...generateAttack([])
        },
        airMeterForward: {
            ...generateAttack([])
        },
        airMeterBack: {
            ...generateAttack([])
        }
    }
}
