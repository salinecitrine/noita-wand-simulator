import { Gun } from './extra/types';

// export function ConfigGun_Init(value: any) {
//   value.actions_per_round = 1
//   value.shuffle_deck_when_empty = false
//   value.reload_time = 40
//   value.deck_capacity = 2
// }

export function ConfigGun_Init(): Gun {
  return {
    actions_per_round: 1,
    shuffle_deck_when_empty: false,
    reload_time: 40,
    deck_capacity: 2,
  };
}
