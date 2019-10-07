import { Character } from "../types";
import { generateAttack, createHitbox } from "../utilities";


export const mmKALLL: Character = {
    name: 'mmKALLL',
    id: 'mmkalll',
    health: 100,
    walkSpeed: 5,
    airSpeed: 8,
    weight: 1,
    maxJumps: 2,
    jumpStrength: 1,
    hurtboxRadius: 20,
    attacks: {
        LightNeutral: {
            ...generateAttack([
                { ...createHitbox(4, 12, 5), radius: 123 },
                { ...createHitbox(12, 20, 10) },
                { ...createHitbox(19, 40, 50) }
            ]),
            projectile: true,
        },
        LightForward: {
            ...generateAttack([])
        },
        LightDown: {
            ...generateAttack([])
        },
        airLightNeutral: {
            ...generateAttack([])
        },
        airLightUp: {
            ...generateAttack([])
        },
        airLightDown: {
            ...generateAttack([])
        },
        airLightForward: {
            ...generateAttack([])
        },
        airLightBack: {
            ...generateAttack([])
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
