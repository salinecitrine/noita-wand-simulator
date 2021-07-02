import { ACTION_TYPE_PROJECTILE } from './gun_enums';
import { GunActionState } from './extra/types';
import { RegisterGunAction } from './extra/ext_functions';

export const defaultGunActionState: GunActionState = {
  action_id: '',
  action_name: '',
  action_description: '',
  action_sprite_filename: '',
  action_unidentified_sprite_filename:
    'data/ui_gfx/gun_actions/unidentified.png',
  action_type: ACTION_TYPE_PROJECTILE,
  action_spawn_level: '',
  action_spawn_probability: '',
  action_spawn_requires_flag: '',
  action_spawn_manual_unlock: false,
  action_max_uses: -1,
  custom_xml_file: '',
  action_mana_drain: 10,
  action_is_dangerous_blast: false,
  action_draw_many_count: 0,
  action_ai_never_uses: false,
  action_never_unlimited: false,
  state_shuffled: false,
  state_cards_drawn: 0,
  state_discarded_action: false,
  state_destroyed_action: false,
  fire_rate_wait: 0,
  speed_multiplier: 1.0,
  child_speed_multiplier: 1.0,
  dampening: 1,
  explosion_radius: 0,
  spread_degrees: 0,
  pattern_degrees: 0,
  screenshake: 0,
  recoil: 0,
  damage_melee_add: 0.0,
  damage_projectile_add: 0.0,
  damage_electricity_add: 0.0,
  damage_fire_add: 0.0,
  damage_explosion_add: 0.0,
  damage_ice_add: 0.0,
  damage_slice_add: 0.0,
  damage_healing_add: 0.0,
  damage_curse_add: 0.0,
  damage_drill_add: 0.0,
  damage_critical_chance: 0,
  damage_critical_multiplier: 0.0,
  explosion_damage_to_materials: 0,
  knockback_force: 0,
  reload_time: 0,
  lightning_count: 0,
  material: '',
  material_amount: 0,
  trail_material: '',
  trail_material_amount: 0,
  bounces: 0,
  gravity: 0,
  light: 0,
  blood_count_multiplier: 1.0,
  gore_particles: 0,
  ragdoll_fx: 0,
  friendly_fire: false,
  physics_impulse_coeff: 0,
  lifetime_add: 0,
  sprite: '',
  extra_entities: '',
  game_effect_entities: '',
  sound_loop_tag: '',
  projectile_file: '',
};

export function ConfigGunActionInfo_Init(value: GunActionState) {
  Object.assign(value, defaultGunActionState);
}

export function ConfigGunActionInfo_PassToGame(value: GunActionState) {
  RegisterGunAction(value);
}

// ext function
function ConfigGunActionInfo_ReadToLua(...args: any[]) {}

export function ConfigGunActionInfo_Copy(source: any, dest: any) {
  dest.action_id = source.action_id;
  dest.action_name = source.action_name;
  dest.action_description = source.action_description;
  dest.action_sprite_filename = source.action_sprite_filename;
  dest.action_unidentified_sprite_filename =
    source.action_unidentified_sprite_filename;
  dest.action_type = source.action_type;
  dest.action_spawn_level = source.action_spawn_level;
  dest.action_spawn_probability = source.action_spawn_probability;
  dest.action_spawn_requires_flag = source.action_spawn_requires_flag;
  dest.action_spawn_manual_unlock = source.action_spawn_manual_unlock;
  dest.action_max_uses = source.action_max_uses;
  dest.custom_xml_file = source.custom_xml_file;
  dest.action_mana_drain = source.action_mana_drain;
  dest.action_is_dangerous_blast = source.action_is_dangerous_blast;
  dest.action_draw_many_count = source.action_draw_many_count;
  dest.action_ai_never_uses = source.action_ai_never_uses;
  dest.action_never_unlimited = source.action_never_unlimited;
  dest.state_shuffled = source.state_shuffled;
  dest.state_cards_drawn = source.state_cards_drawn;
  dest.state_discarded_action = source.state_discarded_action;
  dest.state_destroyed_action = source.state_destroyed_action;
  dest.fire_rate_wait = source.fire_rate_wait;
  dest.speed_multiplier = source.speed_multiplier;
  dest.child_speed_multiplier = source.child_speed_multiplier;
  dest.dampening = source.dampening;
  dest.explosion_radius = source.explosion_radius;
  dest.spread_degrees = source.spread_degrees;
  dest.pattern_degrees = source.pattern_degrees;
  dest.screenshake = source.screenshake;
  dest.recoil = source.recoil;
  dest.damage_melee_add = source.damage_melee_add;
  dest.damage_projectile_add = source.damage_projectile_add;
  dest.damage_electricity_add = source.damage_electricity_add;
  dest.damage_fire_add = source.damage_fire_add;
  dest.damage_explosion_add = source.damage_explosion_add;
  dest.damage_ice_add = source.damage_ice_add;
  dest.damage_slice_add = source.damage_slice_add;
  dest.damage_healing_add = source.damage_healing_add;
  dest.damage_curse_add = source.damage_curse_add;
  dest.damage_drill_add = source.damage_drill_add;
  dest.damage_critical_chance = source.damage_critical_chance;
  dest.damage_critical_multiplier = source.damage_critical_multiplier;
  dest.explosion_damage_to_materials = source.explosion_damage_to_materials;
  dest.knockback_force = source.knockback_force;
  dest.reload_time = source.reload_time;
  dest.lightning_count = source.lightning_count;
  dest.material = source.material;
  dest.material_amount = source.material_amount;
  dest.trail_material = source.trail_material;
  dest.trail_material_amount = source.trail_material_amount;
  dest.bounces = source.bounces;
  dest.gravity = source.gravity;
  dest.light = source.light;
  dest.blood_count_multiplier = source.blood_count_multiplier;
  dest.gore_particles = source.gore_particles;
  dest.ragdoll_fx = source.ragdoll_fx;
  dest.friendly_fire = source.friendly_fire;
  dest.physics_impulse_coeff = source.physics_impulse_coeff;
  dest.lifetime_add = source.lifetime_add;
  dest.sprite = source.sprite;
  dest.extra_entities = source.extra_entities;
  dest.game_effect_entities = source.game_effect_entities;
  dest.sound_loop_tag = source.sound_loop_tag;
  dest.projectile_file = source.projectile_file;
}
