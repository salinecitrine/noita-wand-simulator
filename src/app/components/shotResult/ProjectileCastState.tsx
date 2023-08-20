import { GunActionState } from '../../calc/extra/types';
import { defaultGunActionState } from '../../calc/gunaction_generated';
import styled from 'styled-components';
import { numSign, round } from '../../util/util';

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: monospace;
  color: #fff;
  font-weight: bold;
  min-width: 230px;
  border: 1px solid black;
  padding: 1px;
  font-family: var(--font-family-noita-default);
`;

const StyledListItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
`;

const StyledName = styled.span`
  text-align: left;
  flex: 0 0 150px;
`;

const StyledValue = styled.span`
  text-align: left;
  flex: 0 0 auto;
`;

type ValueOf<T> = T[keyof T];

type FieldDescription = {
  field: keyof GunActionState;
  displayName: string;
  render: (value: ValueOf<GunActionState>) => string;
};

const fields: FieldDescription[] = [
  // {field: 'action_id', displayName: 'action_id', render: (v) => `${v}`},
  // {field: 'action_name', displayName: 'action_name', render: (v) => `${v}`},
  // {field: 'action_description', displayName: 'action_description', render: (v) => `${v}`},
  // {field: 'action_sprite_filename', displayName: 'action_sprite_filename', render: (v) => `${v}`},
  // {field: 'action_unidentified_sprite_filename', displayName: 'action_unidentified_sprite_filename', render: (v) => `${v}`},
  // {field: 'action_type', displayName: 'action_type', render: (v) => `${v}`},
  // {field: 'action_spawn_level', displayName: 'action_spawn_level', render: (v) => `${v}`},
  // {field: 'action_spawn_probability', displayName: 'action_spawn_probability', render: (v) => `${v}`},
  // {field: 'action_spawn_requires_flag', displayName: 'action_spawn_requires_flag', render: (v) => `${v}`},
  // {field: 'action_spawn_manual_unlock', displayName: 'action_spawn_manual_unlock', render: (v) => `${v}`},
  // {field: 'action_max_uses', displayName: 'action_max_uses', render: (v) => `${v}`},
  // {field: 'custom_xml_file', displayName: 'custom_xml_file', render: (v) => `${v}`},
  // {field: 'action_mana_drain', displayName: 'action_mana_drain', render: (v) => `${v}`},
  // {field: 'action_is_dangerous_blast', displayName: 'action_is_dangerous_blast', render: (v) => `${v}`},
  // {field: 'action_draw_many_count', displayName: 'action_draw_many_count', render: (v) => `${v}`},
  // {field: 'action_ai_never_uses', displayName: 'action_ai_never_uses', render: (v) => `${v}`},
  // {field: 'action_never_unlimited', displayName: 'action_never_unlimited', render: (v) => `${v}`},
  {
    field: 'state_shuffled',
    displayName: 'state_shuffled',
    render: (v) => `${v}`,
  },
  {
    field: 'state_cards_drawn',
    displayName: 'state_cards_drawn',
    render: (v) => `${v}`,
  },
  {
    field: 'state_discarded_action',
    displayName: 'state_discarded_action',
    render: (v) => `${v}`,
  },
  {
    field: 'state_destroyed_action',
    displayName: 'state_destroyed_action',
    render: (v) => `${v}`,
  },
  {
    field: 'fire_rate_wait',
    displayName: 'Cast Delay',
    render: (v) => `${numSign(Number(v) / 60, 2)}s`,
  },
  {
    field: 'speed_multiplier',
    displayName: 'Speed',
    render: (v) => `${round(v, 5)}x`,
  },
  {
    field: 'child_speed_multiplier',
    displayName: 'Child Speed',
    render: (v) => `${v}x`,
  },
  { field: 'dampening', displayName: 'Dampening', render: (v) => `${v}` },
  {
    field: 'explosion_radius',
    displayName: 'Explosion Radius',
    render: (v) => `${numSign(Number(v))}`,
  },
  {
    field: 'spread_degrees',
    displayName: 'Spread',
    render: (v) => `${numSign(Number(v), 1)} deg`,
  },
  {
    field: 'pattern_degrees',
    displayName: 'Pattern Angle',
    render: (v) => `±${round(Number(v), 0)} deg`,
  },
  // {field: 'screenshake', displayName: 'screenshake', render: (v) => `${v}`},
  { field: 'recoil', displayName: 'Recoil', render: (v) => `${v}` },
  {
    field: 'damage_melee_add',
    displayName: 'damage_melee_add',
    render: (v) => `${v}`,
  },
  {
    field: 'damage_projectile_add',
    displayName: 'Projectile Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_electricity_add',
    displayName: 'Electricity Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_fire_add',
    displayName: 'Fire Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_explosion_add',
    displayName: 'Explosion Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_ice_add',
    displayName: 'Ice Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_slice_add',
    displayName: 'Slice Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_healing_add',
    displayName: 'Healing Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_curse_add',
    displayName: 'Curse Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_drill_add',
    displayName: 'Drill Damage',
    render: (v) => `${numSign(Number(v) * 25, 0)}`,
  },
  {
    field: 'damage_critical_chance',
    displayName: 'Critical Chance',
    render: (v) => `${numSign(Number(v))}%`,
  },
  {
    field: 'damage_critical_multiplier',
    displayName: 'damage_critical_multiplier',
    render: (v) => `${v}`,
  },
  {
    field: 'explosion_damage_to_materials',
    displayName: 'explosion_damage_to_materials',
    render: (v) => `${v}`,
  },
  {
    field: 'knockback_force',
    displayName: 'knockback_force',
    render: (v) => `${v}`,
  },
  {
    field: 'reload_time',
    displayName: 'Recharge Delay',
    render: (v) => `${numSign(Number(v) / 60, 2)}s`,
  },
  {
    field: 'lightning_count',
    displayName: 'lightning_count',
    render: (v) => `${v}`,
  },
  { field: 'material', displayName: 'Material', render: (v) => `${v}` },
  // {field: 'material_amount', displayName: 'material_amount', render: (v) => `${v}`},
  {
    field: 'trail_material',
    displayName: 'Trail Material',
    render: (v) => `${v}`,
  },
  // {field: 'trail_material_amount', displayName: 'trail_material_amount', render: (v) => `${v}`},
  { field: 'bounces', displayName: 'Bounces', render: (v) => `${v}` },
  { field: 'gravity', displayName: 'Gravity', render: (v) => `${v}` },
  { field: 'light', displayName: 'Light', render: (v) => `${v}` },
  {
    field: 'blood_count_multiplier',
    displayName: 'Blood Count Multiplier',
    render: (v) => `${v}`,
  },
  // {field: 'gore_particles', displayName: 'gore_particles', render: (v) => `${v}`},
  // {field: 'ragdoll_fx', displayName: 'ragdoll_fx', render: (v) => `${v}`},
  {
    field: 'friendly_fire',
    displayName: 'Friendly Fire',
    render: (v) => `${v}`,
  },
  {
    field: 'physics_impulse_coeff',
    displayName: 'Physics Impulse Coeff.',
    render: (v) => `${v}`,
  },
  {
    field: 'lifetime_add',
    displayName: 'Lifetime Modifier',
    render: (v) => `${numSign(Number(v))}`,
  },
  { field: 'sprite', displayName: 'sprite', render: (v) => `${v}` },
  // {field: 'extra_entities', displayName: 'extra_entities', render: (v) => `${v}`},
  // {field: 'game_effect_entities', displayName: 'game_effect_entities', render: (v) => `${v}`},
  // {field: 'sound_loop_tag', displayName: 'sound_loop_tag', render: (v) => `${v}`},
  {
    field: 'projectile_file',
    displayName: 'projectile_file',
    render: (v) => `${v}`,
  },
];

// todo: handle extra_entities that affect damage/etc

type Props = {
  castState?: GunActionState;
};

export function ProjectileCastState(props: Props) {
  const { castState } = props;
  if (!castState) {
    return null;
  }
  return (
    <StyledList>
      {fields.map(({ field, displayName, render }) => {
        if (castState[field] === defaultGunActionState[field]) {
          return null;
        }
        return (
          <StyledListItem key={field}>
            <StyledName>{displayName}</StyledName>
            <StyledValue>{render(castState[field])}</StyledValue>
          </StyledListItem>
        );
      })}
    </StyledList>
  );
}
