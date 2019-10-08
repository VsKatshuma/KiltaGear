import { Character } from "../types";
import { generateAttack, createHitbox } from "../utilities";


export const mmKALLL: Character = {
    name: 'mmKALLL',
    id: 'mmkalll',
    maxHealth: 100,
    walkSpeed: 5,
    airSpeed: 8,
    weight: 1,
    maxJumps: 2,
    jumpStrength: 1,
    hurtboxRadius: 20,
    attacks: {
        LightNeutral: {
            ...generateAttack([
                { ...createHitbox(4, 6, 3) },
                { ...createHitbox(12, 20, 6)  }
            ]),
            projectile: false,
        },
        LightForward: {
            ...generateAttack([
                { ...createHitbox(20, 30, 13) }
            ]),
            projectile: false,
        },
        LightDown: {
            ...generateAttack([
                { ...createHitbox(9, 14, 5), radius: 10, x: 80 }
            ])
        },
        airLightNeutral: {
            ...generateAttack([
                { ...createHitbox(9, 16, 6) },
                { ...createHitbox(45, 55, 11) },
                { ...createHitbox(90, 110, 3), radius: 70 }
            ])
        },
        airLightUp: {
            ...generateAttack([
                { ...createHitbox(11, 30, 14), y: -50 }
            ])
        },
        airLightDown: {
            ...generateAttack([
                { ...createHitbox(30, 50, 22) }
            ])
        },
        airLightForward: {
            ...generateAttack([
                { ...createHitbox(4, 40, 5), radius: 30 }
            ])
        },
        airLightBack: {
            ...generateAttack([
                { ...createHitbox(4, 10, 6), radius: 15,   x: -10 },
                { ...createHitbox(11, 20, 6), radius: 15,  x: -30 },
                { ...createHitbox(18, 30, 6), radius: 15,  x: -50 },
                { ...createHitbox(25, 40, 6), radius: 15,  x: -70 },
                { ...createHitbox(31, 50, 6), radius: 15,  x: -90 },
                { ...createHitbox(35, 60, 6), radius: 15,  x: -10 },
                { ...createHitbox(41, 70, 6), radius: 15,  x: -30 },
                { ...createHitbox(47, 80, 6), radius: 15,  x: -50 },
                { ...createHitbox(54, 90, 6), radius: 15,  x: -70 },
                { ...createHitbox(60, 100, 6), radius: 15, x: -90 },
                { ...createHitbox(66, 110, 6), radius: 15, x: -10 },
                { ...createHitbox(71, 120, 6), radius: 15, x: -30 },
                { ...createHitbox(77, 130, 6), radius: 15, x: -50 },
                { ...createHitbox(85, 140, 6), radius: 15, x: -70 },
                { ...createHitbox(91, 150, 6), radius: 15, x: -90 },
            ])
        },
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
