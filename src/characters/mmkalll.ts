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
                { ...createHitbox(4, 12, 5), radius: 50 },
                { ...createHitbox(12, 20, 10) }
            ]),
            projectile: false,
        },
        LightForward: {
            ...generateAttack([
                { ...createHitbox(12, 20, 10), radius: 100 }
            ]),
            projectile: false,
        },
        LightDown: {
            ...generateAttack([
                { ...createHitbox(12, 20, 20), radius: 10 }
            ])
        },
        airLightNeutral: {
            ...generateAttack([
                { ...createHitbox(12, 20, 20), radius: 25 }
            ])
        },
        airLightUp: {
            ...generateAttack([
                { ...createHitbox(12, 20, 50), radius: 50 }
            ])
        },
        airLightDown: {
            ...generateAttack([
                { ...createHitbox(12, 20, 50), radius: 100 }
            ])
        },
        airLightForward: {
            ...generateAttack([
                { ...createHitbox(12, 20, 5), radius: 30 }
            ])
        },
        airLightBack: {
            ...generateAttack([
                { ...createHitbox(12, 20, 10), radius: 190 }
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
