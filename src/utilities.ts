import { NeutralCharacterState, AttackStrength, AttackDirection } from './types'

export const getAttackString = (state: NeutralCharacterState, attack: AttackStrength, direction: AttackDirection): string => {
  return `${state === 'groundborne' ? '' : 'air'}${attack}${direction}`
}
