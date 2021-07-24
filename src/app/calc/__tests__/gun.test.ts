import {
  _add_card_to_deck,
  _clear_deck,
  _draw_actions_for_shot,
  _start_shot,
  deck,
  discarded,
  hand,
} from '../gun';
import * as ext from '../extra/ext_functions';
import { getActionById } from '../eval/util';
import { Gun } from '../extra/types';
import { clickWand } from '../eval/clickWand';

beforeEach(() => {
  jest.spyOn(ext, 'BeginProjectile');
  _clear_deck(false);
});

afterEach(() => {
  jest.resetAllMocks();
});

it('one shot no reload', () => {
  _add_card_to_deck('LIGHT_BULLET', 0, null, true);
  expect(deck.length).toEqual(1);
  _start_shot(1000);
  _draw_actions_for_shot(false);
  expect(hand.length).toEqual(1);
  expect(ext.BeginProjectile).toHaveBeenCalledTimes(1);
});

it('one shot with reload', () => {
  _add_card_to_deck('LIGHT_BULLET', 0, null, true);
  expect(deck.length).toEqual(1);
  _start_shot(1000);
  _draw_actions_for_shot(true);
  expect(deck.length).toEqual(1);
  expect(ext.BeginProjectile).toHaveBeenCalledTimes(1);
});

it('several shots', () => {
  _add_card_to_deck('BURST_3', 0, null, true);
  _add_card_to_deck('LIGHT_BULLET', 1, null, true);
  _add_card_to_deck('LIGHT_BULLET', 2, null, true);
  _add_card_to_deck('LIGHT_BULLET', 3, null, true);
  expect(deck.length).toEqual(4);
  _start_shot(1000);
  _draw_actions_for_shot(false);
  expect(deck.length).toEqual(0);
  expect(ext.BeginProjectile).toHaveBeenCalledTimes(3);
});

it('several casts before recharge', () => {
  _add_card_to_deck('LIGHT_BULLET', 1, null, true);
  _add_card_to_deck('LIGHT_BULLET', 2, null, true);
  _add_card_to_deck('LIGHT_BULLET', 3, null, true);
  expect(deck.length).toEqual(3);
  _start_shot(1000);
  expect([discarded.length, hand.length, deck.length]).toEqual([0, 0, 3]);
  _draw_actions_for_shot(true);
  expect([discarded.length, hand.length, deck.length]).toEqual([1, 0, 2]);
  _draw_actions_for_shot(true);
  expect([discarded.length, hand.length, deck.length]).toEqual([2, 0, 1]);

  // this should actually reload
  _draw_actions_for_shot(true);
  expect([discarded.length, hand.length, deck.length]).toEqual([0, 0, 3]);
});

it('tau', () => {
  _add_card_to_deck('TAU', 1, null, true);
  _add_card_to_deck('LIGHT_BULLET', 2, null, true);
  _add_card_to_deck('LIGHT_BULLET', 3, null, true);
  expect(deck.length).toEqual(3);
  _start_shot(1000);
  expect([discarded.length, hand.length, deck.length]).toEqual([0, 0, 3]);
  expect(ext.BeginProjectile).toHaveBeenCalledTimes(0);
  _draw_actions_for_shot(true);
  expect([discarded.length, hand.length, deck.length]).toEqual([1, 0, 2]);
  expect(ext.BeginProjectile).toHaveBeenCalledTimes(2);
  _draw_actions_for_shot(true);
  expect([discarded.length, hand.length, deck.length]).toEqual([2, 0, 1]);
  expect(ext.BeginProjectile).toHaveBeenCalledTimes(3);

  // this should actually reload
  _draw_actions_for_shot(true);
  expect([discarded.length, hand.length, deck.length]).toEqual([0, 0, 3]);
  expect(ext.BeginProjectile).toHaveBeenCalledTimes(4);
});

it('clickWand', () => {
  const gun: Gun = {
    actions_per_round: 1,
    shuffle_deck_when_empty: false,
    reload_time: 0,
    deck_capacity: 10,
  };
  const spells = ['DAMAGE', 'LIGHT_BULLET_TRIGGER', 'BOMB'].map(getActionById);

  const expected = [
    [
      {
        id: 'data/entities/projectiles/deck/light_bullet.xml',
        info: expect.objectContaining({
          action_name: '$action_light_bullet_trigger',
        }),
        triggers: [
          {
            id: 'data/entities/projectiles/bomb.xml',
            info: expect.objectContaining({
              action_name: '$action_bomb',
            }),
          },
        ],
      },
    ],
  ];

  const result = clickWand(gun, spells, 1000, true);
  expect(result).toEqual(expected);
});

it('clickWand 2', () => {
  const gun: Gun = {
    actions_per_round: 1,
    shuffle_deck_when_empty: false,
    reload_time: 0,
    deck_capacity: 10,
  };
  const spells = ['DAMAGE', 'LIGHT_BULLET_TRIGGER', 'BOMB', 'LIGHT_BULLET'].map(
    getActionById,
  );

  const expected = [
    [
      {
        id: 'data/entities/projectiles/deck/light_bullet.xml',
        info: expect.objectContaining({
          damage_projectile_add: 0.4,
          fire_rate_wait: 11,
        }),
        triggers: [
          {
            id: 'data/entities/projectiles/bomb.xml',
            info: expect.objectContaining({
              damage_projectile_add: 0,
              fire_rate_wait: 100,
            }),
          },
        ],
      },
    ],
    [
      {
        id: 'data/entities/projectiles/deck/light_bullet.xml',
        info: expect.objectContaining({
          damage_projectile_add: 0,
          fire_rate_wait: 11,
        }),
      },
    ],
  ];

  const result = clickWand(gun, spells, 1000, true);
  expect(result).toEqual(expected);
});
