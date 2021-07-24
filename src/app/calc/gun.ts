import { ConfigGun_Init } from './gun_generated';
import {
  ConfigGunActionInfo_Copy,
  ConfigGunActionInfo_Init,
  ConfigGunActionInfo_PassToGame,
} from './gunaction_generated';
import {
  ConfigGunShotEffects_Init,
  ConfigGunShotEffects_PassToGame,
} from './gunshoteffects_generated';
import {
  Action,
  Gun,
  GunActionState,
  ModifierName,
  Shot,
  ShotEffects,
} from './extra/types';
import { Random } from './extra/util';
import {
  ACTION_TYPE_MATERIAL,
  ACTION_TYPE_OTHER,
  ACTION_TYPE_PROJECTILE,
  ACTION_TYPE_STATIC_PROJECTILE,
  ACTION_TYPE_UTILITY,
} from './gun_enums';
import { extra_modifiers } from './gun_extra_modifiers';
import {
  ActionUsed,
  ActionUsesRemainingChanged,
  BaabInstruction,
  BeginProjectile,
  BeginTriggerDeath,
  BeginTriggerHitWorld,
  BeginTriggerTimer,
  EndProjectile,
  EndTrigger,
  LogAction,
  OnActionCalled,
  OnActionFinished,
  OnActionPlayed,
  OnNotEnoughManaForAction,
  Reflection_RegisterProjectile,
  SetProjectileConfigs,
  StartReload,
} from './extra/ext_functions';
import { init_state_from_game } from './extra/init';
import { actions } from './__generated__/gun_actions';
import { ActionSource } from './util';

// constants
export const ACTION_DRAW_RELOAD_TIME_INCREASE = 0;
const ACTION_MANA_DRAIN_DEFAULT = 10;
const ACTION_UNIDENTIFIED_SPRITE_DEFAULT =
  'data/ui_gfx/gun_actions/unidentified.png';

// passing data to C++ code (reflection)
export let reflecting = false;
let current_action: Action | null = null;

// gun current state

let first_shot = true;
let reloading = false;
let start_reload = false;
let got_projectiles = false;

let state_from_game: GunActionState = init_state_from_game();

export let discarded: Action[] = [];

export function clearDiscarded() {
  discarded.length = 0;
}

export let deck: Action[] = [];

export function clearDeck() {
  deck.length = 0;
}

export let hand: Action[] = [];

export function clearHand() {
  hand.length = 0;
}

export let c: GunActionState;
let current_projectile = null;
export let current_reload_time = 0;

export function setCurrentReloadTime(crt: number) {
  current_reload_time = crt;
}

export let shot_effects: ShotEffects = {
  recoil_knockback: 0,
};

let active_extra_modifiers: ModifierName[] = [];

export let mana = 0.0;

export function setMana(m: number) {
  mana = m;
}

let state_shuffled = false;
let state_cards_drawn = 0;
let state_discarded_action = false;
let state_destroyed_action = false;

let playing_permanent_card = false;

let use_game_log = false;

// initialize global/constant gun state
export let gun = ConfigGun_Init();
// ConfigGun_Init(gun)
current_reload_time = gun.reload_time;

// setup additional card-related variables
export let dont_draw_actions = false;

export function setDontDrawActions(dda: boolean) {
  dont_draw_actions = dda;
}

export let force_stop_draws = false;

export function setForceStopDraws(fsd: boolean) {
  force_stop_draws = fsd;
}

let shot_structure = {};
let recursion_limit = 2;

// action effect reflection stuff

function reset_modifiers(state: GunActionState) {
  ConfigGunActionInfo_Init(state);
}

function register_action(state: GunActionState) {
  state.reload_time = current_reload_time;
  ConfigGunActionInfo_PassToGame(state);
}

function register_gunshoteffects(effects: ShotEffects) {
  ConfigGunShotEffects_PassToGame(effects);
}

// call this when current action changes

function set_current_action(action: Action) {
  c.action_id = action.id;
  c.action_name = action.name;
  c.action_description = action.description;
  c.action_sprite_filename = action.sprite;
  c.action_type = action.type;
  c.action_recursive = action.recursive;
  c.action_spawn_level = action.spawn_level;
  c.action_spawn_probability = action.spawn_probability;
  c.action_spawn_requires_flag = action.spawn_requires_flag;
  c.action_spawn_manual_unlock = action.spawn_manual_unlock || false;
  c.action_max_uses = action.max_uses;
  c.custom_xml_file = action.custom_xml_file;
  c.action_ai_never_uses = action.ai_never_uses || false;
  c.action_never_unlimited = action.never_unlimited || false;

  c.action_is_dangerous_blast = action.is_dangerous_blast;

  c.sound_loop_tag = action.sound_loop_tag;

  c.action_mana_drain = action.mana;
  if (action.mana == null) {
    c.action_mana_drain = ACTION_MANA_DRAIN_DEFAULT;
  }

  c.action_unidentified_sprite_filename = action.sprite_unidentified;
  if (action.sprite_unidentified == null) {
    c.action_unidentified_sprite_filename = ACTION_UNIDENTIFIED_SPRITE_DEFAULT;
  }

  current_action = action;
}

function clone_action(source: Action, target: Action) {
  target.id = source.id;
  target.name = source.name;
  target.type = source.type;
  target.recursive = source.recursive;
  target.related_projectiles = source.related_projectiles;
  target.related_extra_entities = source.related_extra_entities;
  target.action = source.action;
  target.deck_index = source.deck_index;
  target.custom_uses_logic = source.custom_uses_logic;
  target.mana = source.mana;
  target.sound_loop_tag = source.sound_loop_tag;

  //added
  target.sprite = source.sprite;
}

// various utilities

function create_shot(num_of_cards_to_draw: number): Shot {
  let shot: any = {};
  shot.state = {};
  reset_modifiers(shot.state);
  shot.num_of_cards_to_draw = num_of_cards_to_draw;
  return shot;
}

function draw_shot(shot: Shot, instant_reload_if_empty: boolean) {
  let c_old = c;

  c = shot.state;

  shot_structure = {};
  draw_actions(shot.num_of_cards_to_draw, instant_reload_if_empty);
  register_action(shot.state);
  SetProjectileConfigs();

  c = c_old;
}

// helper functions. actions may call these

export function order_deck() {
  if (gun.shuffle_deck_when_empty) {
    // SetRandomSeed( GameGetFrameNum(), GameGetFrameNum() )
    // shuffle the deck
    state_shuffled = true;

    let rand = Random;
    let iterations = deck.length;
    let new_deck: Action[] = [];

    for (let i = iterations; i >= 0; i--) {
      // looping from iterations to 1 (inclusive)
      let index = rand(0, i);
      let action = deck[index];
      deck.splice(index, 1);
      new_deck.push(action);
    }

    deck = new_deck;
  } else {
    // sort the deck
    if (!force_stop_draws) {
      deck.sort((a, b) => {
        let a_index = a.deck_index || 0;
        let b_index = b.deck_index || 0;
        return a_index - b_index;
      });
    } else {
      deck.sort((a, b) => {
        let a_ = a.deck_index || 0;
        let b_ = b.deck_index || 0;
        return a_ - b_;
      });
    }
  }
}

function play_action(action: Action) {
  OnActionPlayed(action.id);

  hand.push(action);

  set_current_action(action);
  call_action(ActionSource.DRAW, action, c);

  let is_projectile = false;

  if (action.type === ACTION_TYPE_PROJECTILE) {
    is_projectile = true;
    got_projectiles = true;
  }

  if (action.type === ACTION_TYPE_STATIC_PROJECTILE) {
    is_projectile = true;
    got_projectiles = true;
  }

  if (action.type === ACTION_TYPE_MATERIAL) {
    is_projectile = true;
    got_projectiles = true;
  }

  if (is_projectile) {
    active_extra_modifiers.forEach((modifier) => {
      extra_modifiers[modifier](c);
    });
  }

  current_reload_time = current_reload_time + ACTION_DRAW_RELOAD_TIME_INCREASE;
}

export function draw_action(instant_reload_if_empty: boolean) {
  let action = null;

  state_cards_drawn = state_cards_drawn + 1;

  if (reflecting) {
    return;
  }

  if (deck.length <= 0) {
    if (instant_reload_if_empty && !force_stop_draws) {
      move_discarded_to_deck();
      order_deck();
      start_reload = true;
    } else {
      reloading = true;
      return true;
    }
  }

  if (deck.length > 0) {
    // draw from the start of the deck
    action = deck[0];

    deck.shift();

    // update mana
    let action_mana_required = action.mana;
    if (action.mana == null) {
      action_mana_required = ACTION_MANA_DRAIN_DEFAULT;
    }

    if (action_mana_required! > mana) {
      OnNotEnoughManaForAction();
      discarded.push(action);
      return false;
    }

    if (action.uses_remaining === 0) {
      discarded.push(action);
      return false;
    }

    mana = mana - action_mana_required!;
  }

  //- add the action to hand and execute it //-
  if (action !== null) {
    play_action(action);
  }

  return true;
}

function handle_mana_addition(action: Action) {
  if (action !== null) {
    let action_mana_required = action.mana || 0;

    if (action_mana_required < 0) {
      mana = mana - action_mana_required;
    }
  }
}

export function draw_actions(
  how_many: number,
  instant_reload_if_empty: boolean,
) {
  if (!dont_draw_actions) {
    c.action_draw_many_count = how_many;

    if (playing_permanent_card && how_many === 1) {
      // SPECIAL RULE: modifiers that use draw_actions(1) to draw one
      // more action don't result in two actions being drawn after them
      // if the modifier is permanently attached and wand 'casts 1'

      return;
    }

    for (let i = 0; i < how_many; i++) {
      let ok = draw_action(instant_reload_if_empty);
      if (!ok) {
        // attempt to draw other actions
        while (deck.length > 0) {
          if (draw_action(instant_reload_if_empty)) {
            break;
          }
        }
      }

      if (reloading) {
        return;
      }
    }
  }
}

export function add_projectile(entity_filename: string) {
  if (reflecting) {
    Reflection_RegisterProjectile(entity_filename);
    return;
  }

  BeginProjectile(entity_filename);
  EndProjectile();
}

export function add_projectile_trigger_timer(
  entity_filename: string,
  delay_frames: number,
  action_draw_count: number,
) {
  if (reflecting) {
    Reflection_RegisterProjectile(entity_filename);
    return;
  }

  BeginProjectile(entity_filename);
  BeginTriggerTimer(delay_frames);
  draw_shot(create_shot(action_draw_count), true);
  EndTrigger();
  EndProjectile();
}

export function add_projectile_trigger_hit_world(
  entity_filename: string,
  action_draw_count: number,
) {
  if (reflecting) {
    Reflection_RegisterProjectile(entity_filename);
    return;
  }

  BeginProjectile(entity_filename);
  BeginTriggerHitWorld();
  draw_shot(create_shot(action_draw_count), true);
  EndTrigger();
  EndProjectile();
}

export function add_projectile_trigger_death(
  entity_filename: string,
  action_draw_count: number,
) {
  if (reflecting) {
    Reflection_RegisterProjectile(entity_filename);
    return;
  }

  BeginProjectile(entity_filename);
  BeginTriggerDeath();
  draw_shot(create_shot(action_draw_count), true);
  EndTrigger();
  EndProjectile();
}

function baab_instruction(name: string) {
  if (reflecting) {
    return;
  }

  BaabInstruction(name);
}

export function move_discarded_to_deck() {
  discarded.forEach((action) => {
    deck.push(action);
  });
  discarded.length = 0;
}

function move_hand_to_discarded() {
  hand.forEach((action) => {
    let identify = false;

    // ACTION_TYPE_MATERIAL, ACTION_TYPE_PROJECTILE are handled via got_projectiles
    if (
      got_projectiles ||
      action.type === ACTION_TYPE_OTHER ||
      action.type === ACTION_TYPE_UTILITY
    ) {
      if (action.uses_remaining && action.uses_remaining > 0) {
        if (action.custom_uses_logic) {
          // do nothing
        } else if (action.is_identified) {
          // consume consumable actions
          action.uses_remaining = action.uses_remaining - 1;
          let reduce_uses = ActionUsesRemainingChanged(
            action.inventoryitem_id,
            action.uses_remaining,
          );
          if (!reduce_uses) {
            action.uses_remaining = action.uses_remaining + 1; // cancel the reduction
          }
        }
      }

      identify = true;
    }

    if (identify) {
      ActionUsed(action.inventoryitem_id);
      action.is_identified = true;
    }

    if (use_game_log) {
      if (action.is_identified) {
        LogAction(action.name);
      } else {
        LogAction('?');
      }
    }

    if (action.uses_remaining !== 0 || action.custom_uses_logic) {
      if (action.permanently_attached == null) {
        discarded.push(action);
      }
    }
  });
  clearHand();
}

export function check_recursion(data: Action | null, rec_: number) {
  let rec = rec_ || 0;

  if (data != null) {
    if (data.recursive !== null && data.recursive) {
      if (rec >= recursion_limit) {
        return -1;
      } else {
        return rec + 1;
      }
    }
  }

  return rec;
}

// -- exported functions. called by the C++ code --

// call this to do one shot (or round, or turn)
let root_shot: Shot | null = null;

export function _start_shot(current_mana: number) {
  // debug checks
  // if (state_from_game === null) {
  //   console.log("'gun.lua' - state_from_game is nil - did we ever initialize this gun?")
  //   return
  // }

  dont_draw_actions = false;
  force_stop_draws = false;

  // create the initial shot
  root_shot = create_shot(1);
  c = root_shot.state;

  // set up the initial state for the selected gun
  ConfigGunActionInfo_Copy(state_from_game, c);
  ConfigGunShotEffects_Init(shot_effects);

  root_shot.num_of_cards_to_draw = gun.actions_per_round;

  mana = current_mana;

  // set the deck order if required
  if (first_shot) {
    order_deck();
    current_reload_time = gun.reload_time;
    first_shot = false;
  }

  got_projectiles = false;
}

export function _draw_actions_for_shot(can_reload_at_end: boolean) {
  // draw  actions
  draw_shot(root_shot!, false);

  register_gunshoteffects(shot_effects);

  // finish the turn
  if (can_reload_at_end) {
    _handle_reload();
  }

  active_extra_modifiers.length = 0;

  reloading = false;
}

function _handle_reload() {
  move_hand_to_discarded();

  // start a reload?
  if (!reloading && (deck.length <= 0 || start_reload)) {
    move_discarded_to_deck();
    order_deck();

    StartReload(current_reload_time);
    current_reload_time = gun.reload_time;
    start_reload = false;
  }

  return mana;
}

export function _set_gun(g: Gun) {
  gun = g;
}

// this can be used to build a new deck
export function _clear_deck(use_game_log_: boolean) {
  hand = [];
  discarded = [];
  deck = [];
  first_shot = true;
  current_reload_time = 0;
  reloading = false;

  use_game_log = use_game_log_;
}

// this can be used to build a new deck
export function _add_card_to_deck(
  action_id: string,
  inventoryitem_id: number,
  uses_remaining: number | undefined | null,
  is_identified: boolean,
) {
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    if (action.id === action_id) {
      let action_clone = {} as Action;
      clone_action(action, action_clone);
      action_clone.inventoryitem_id = inventoryitem_id;
      action_clone.uses_remaining =
        uses_remaining != null ? uses_remaining : undefined;
      action_clone.deck_index = deck.length;
      action_clone.is_identified = is_identified;
      deck.push(action_clone);
      break;
    }
  }
}

function _play_permanent_card(action_id: string) {
  for (let i = 0; i < actions.length; i++) {
    let action = actions[i];
    if (action.id === action_id) {
      let action_clone = {} as Action;
      playing_permanent_card = true;
      clone_action(action, action_clone);
      action_clone.permanently_attached = true;
      action_clone.uses_remaining = -1;
      handle_mana_addition(action_clone);
      play_action(action_clone);

      playing_permanent_card = false;
      break;
    }
  }
}

function _change_action_uses_remaining(
  inventoryitem_id: number,
  uses_remaining: number,
) {
  let applied = false;

  const apply = (arr: Action[]) => {
    if (applied) {
      return;
    }

    for (let i = 0; i < actions.length; i++) {
      let action = arr[i];
      if (action.inventoryitem_id === inventoryitem_id) {
        action.uses_remaining = uses_remaining;
        applied = true;
        break;
      }
    }
  };

  apply(deck);
  apply(discarded);
  apply(hand);
}

function _add_extra_modifier_to_shot(name: ModifierName) {
  if (!extra_modifiers[name]) {
    console.log(
      "_add_extra_modifier_to_shot() - function '" +
        name +
        "' not found in gun_extra_modifiers.lua",
    );
    return;
  }

  active_extra_modifiers.push(name);
}

// custom
export function call_action(
  source: ActionSource,
  action: Action,
  c: GunActionState,
  ...args: number[]
) {
  OnActionCalled(source, action, c, ...args);
  return action.action(c, ...args);
}
