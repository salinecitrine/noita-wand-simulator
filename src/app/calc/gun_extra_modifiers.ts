import { Random } from './extra/util';
import {
  call_action,
  current_reload_time,
  hand,
  setCurrentReloadTime,
  shot_effects,
} from './gun';
import { GunActionState } from './extra/types';
import { ActionSource } from './util';

export const extra_modifiers = {
  critical_hit_boost: (c: GunActionState) => {
    c.damage_critical_chance = c.damage_critical_chance + 5;
  },
  critical_plus_small: (c: GunActionState) => {
    c.damage_critical_chance = c.damage_critical_chance + 40;
  },
  powerful_shot: (c: GunActionState) => {
    c.damage_explosion_add = c.damage_explosion_add + 0.1;
    c.damage_projectile_add = c.damage_projectile_add + 0.6;
    c.speed_multiplier = c.speed_multiplier * 2.5;
    c.lifetime_add = c.lifetime_add + 20;
  },
  food_clock: (c: GunActionState) => {
    c.extra_entities =
      c.extra_entities + 'data/entities/misc/perks/food_clock.xml,';
  },
  damage_plus_small: (c: GunActionState) => {
    c.damage_projectile_add = c.damage_projectile_add + 0.3;
    c.damage_projectile_add = c.damage_projectile_add * 1.25;
    c.damage_healing_add = c.damage_healing_add * 1.25;
  },
  damage_projectile_boost: (c: GunActionState) => {
    c.damage_projectile_mul = (c.damage_projectile_mul || 0) + 0.5;
  },
  game_effect_freeze: (c: GunActionState) => {
    c.game_effect_entities =
      c.game_effect_entities + 'data/entities/misc/effect_frozen.xml,';
  },
  extra_knockback: (c: GunActionState) => {
    c.knockback_force = c.knockback_force + 6;
  },
  lower_spread: (c: GunActionState) => {
    c.spread_degrees = c.spread_degrees - 25;
    c.damage_explosion_add = c.damage_explosion_add + 0.2;
    c.damage_projectile_add = c.damage_projectile_add + 0.5;
    c.fire_rate_wait = c.fire_rate_wait + 2;
    shot_effects.recoil_knockback = shot_effects.recoil_knockback + 10.0;
  },
  laser_aim: (c: GunActionState) => {
    c.spread_degrees = c.spread_degrees - 20;
    c.speed_multiplier = c.speed_multiplier * 1.4;
  },
  low_recoil: (c: GunActionState) => {
    c.speed_multiplier = c.speed_multiplier * 0.8;
    shot_effects.recoil_knockback = shot_effects.recoil_knockback * 0.5 - 16.0;
  },
  bounce: (c: GunActionState) => {
    c.bounces = c.bounces + 3;
    c.lifetime_add = c.lifetime_add + 60;
  },
  projectile_homing_shooter: (c: GunActionState) => {
    c.extra_entities =
      c.extra_entities +
      'data/entities/misc/perks/projectile_homing_shooter.xml,';
  },
  projectile_homing_shooter_wizard: (c: GunActionState) => {
    c.extra_entities =
      c.extra_entities +
      'data/entities/misc/perks/projectile_homing_shooter.xml,';
  },
  projectile_alcohol_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'alcohol,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  fizzle: (c: GunActionState) => {
    c.extra_entities = c.extra_entities + 'data/entities/misc/fizzle.xml,';
  },
  explosive_projectile: (c: GunActionState) => {
    c.explosion_radius = c.explosion_radius + 15.0;
    c.damage_explosion_add = c.damage_explosion_add + 0.4;
    c.damage_projectile_add = c.damage_projectile_add + 0.2;
    c.fire_rate_wait = c.fire_rate_wait + 40;
    c.speed_multiplier = c.speed_multiplier * 0.75;
    shot_effects.recoil_knockback = shot_effects.recoil_knockback + 30.0;
  },
  projectile_fire_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'fire,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  projectile_acid_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'acid,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  projectile_oil_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'oil,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  projectile_water_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'water,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  projectile_gunpowder_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'gunpowder_unstable,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  projectile_poison_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'poison,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  projectile_lava_trail: (c: GunActionState) => {
    c.trail_material = c.trail_material + 'lava,';
    c.trail_material_amount = c.trail_material_amount + 5;
  },
  gravity: (c: GunActionState) => {
    c.gravity = c.gravity + 600.0;
  },
  antigravity: (c: GunActionState) => {
    c.gravity = c.gravity - 600.0;
  },
  duplicate_projectile: (c: GunActionState) => {
    let data = hand[hand.length - 1];

    // SetRandomSeed( GameGetFrameNum(), GameGetFrameNum() - 523 )

    if (data !== null && Random(1, 2) === 1) {
      call_action(ActionSource.PERK, data, c);
    }
  },
  high_spread: (c: GunActionState) => {
    c.spread_degrees = c.spread_degrees + 30;
  },
  extreme_spread: (c: GunActionState) => {
    c.spread_degrees = c.spread_degrees + 80;
  },
  fast_projectiles: (c: GunActionState) => {
    c.speed_multiplier = c.speed_multiplier * 1.75;
  },
  slow_firing: (c: GunActionState) => {
    c.fire_rate_wait = c.fire_rate_wait + 5;
    setCurrentReloadTime(current_reload_time + 5);
  },
} as const;
