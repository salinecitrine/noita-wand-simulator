import { Action, ComponentID, EntityID, GunActionState } from './types';

// listener logic

type Callback = (eventType: string, ...args: any[]) => void;

let listeners: Callback[] = [];

export function subscribe(callback: Callback) {
  listeners.push(callback);
  return () => (listeners = listeners.filter((l) => l !== callback));
}

function onEvent(eventType: string, ...args: any[]): any {
  listeners.forEach((c) => c(eventType, ...args));
  if (overrides[eventType]) {
    // console.log('onEvent.override', eventType, args);
    return overrides[eventType]?.(args);
  }
}

type OverrideCallback = (...args: any[]) => void;
let overrides: { [eventType: string]: OverrideCallback | undefined } = {};

export function override(eventType: string, callback: OverrideCallback) {
  overrides[eventType] = callback;
  return () => {
    if (overrides[eventType] === callback) {
      overrides[eventType] = undefined;
    }
  };
}

// ext functions

export function SetProjectileConfigs() {
  const result = onEvent('SetProjectileConfigs');
  if (result !== undefined) {
    return result;
  }
}

export function OnNotEnoughManaForAction() {
  const result = onEvent('OnNotEnoughManaForAction');
  if (result !== undefined) {
    return result;
  }
}

export function RegisterGunShotEffects(recoil_knockback: any) {
  const result = onEvent('RegisterGunShotEffects', recoil_knockback);
  if (result !== undefined) {
    return result;
  }
}

export function Reflection_RegisterProjectile(entity_filename: string) {
  const result = onEvent('Reflection_RegisterProjectile', entity_filename);
  if (result !== undefined) {
    return result;
  }
}

export function BeginProjectile(entity_filename: string) {
  const result = onEvent('BeginProjectile', entity_filename);
  if (result !== undefined) {
    return result;
  }
}

export function EndProjectile() {
  const result = onEvent('EndProjectile');
  if (result !== undefined) {
    return result;
  }
}

export function BeginTriggerTimer(delay_frames: number) {
  const result = onEvent('BeginTriggerTimer', delay_frames);
  if (result !== undefined) {
    return result;
  }
}

export function BeginTriggerHitWorld() {
  const result = onEvent('BeginTriggerHitWorld');
  if (result !== undefined) {
    return result;
  }
}

export function BeginTriggerDeath() {
  const result = onEvent('BeginTriggerDeath');
  if (result !== undefined) {
    return result;
  }
}

export function EndTrigger() {
  const result = onEvent('EndTrigger');
  if (result !== undefined) {
    return result;
  }
}

export function BaabInstruction(name: string) {
  const result = onEvent('BaabInstruction', name);
  if (result !== undefined) {
    return result;
  }
}

export function ActionUsesRemainingChanged(
  item_id: any,
  uses_remaining: number,
) {
  const result = onEvent('ActionUsesRemainingChanged', item_id, uses_remaining);
  if (result !== undefined) {
    return result;
  }
  return false;
}

export function ActionUsed(item_id: any) {
  const result = onEvent('ActionUsed', item_id);
  if (result !== undefined) {
    return result;
  }
}

export function LogAction(s: string) {
  const result = onEvent('LogAction', s);
  if (result !== undefined) {
    return result;
  }
}

export function StartReload(reload_time: number) {
  const result = onEvent('StartReload', reload_time);
  if (result !== undefined) {
    return result;
  }
}

export function RegisterGunAction(s: GunActionState) {
  const result = onEvent('RegisterGunAction', s);
  if (result !== undefined) {
    return result;
  }
}

export function EntityGetWithTag(tag: string): any {
  const result = onEvent('EntityGetWithTag', tag);
  if (result !== undefined) {
    return result;
  }
  return {};
}

export function GetUpdatedEntityID(): EntityID {
  const result = onEvent('GetUpdatedEntityID');
  if (result !== undefined) {
    return result;
  }
  return 'dummy entity';
}

export function EntityGetComponent(
  entity_id: string,
  component: string,
): ComponentID[] {
  const result = onEvent('EntityGetComponent', entity_id, component);
  if (result !== undefined) {
    return result;
  }
  return [component];
}

export function EntityGetFirstComponent(
  entity_id: any,
  component: string,
): any {
  const result = onEvent('EntityGetFirstComponent', entity_id, component);
  if (result !== undefined) {
    return result;
  }
  return {};
}

export function EntityGetFirstComponentIncludingDisabled(
  entity_id: any,
  component: string,
): any {
  const result = onEvent(
    'EntityGetFirstComponentIncludingDisabled',
    entity_id,
    component,
  );
  if (result !== undefined) {
    return result;
  }
  return {};
}

const componentValues: { [component_id: string]: { [key: string]: any } } = {
  'dummy entity': {
    money: 1e18,
    hp: 1e18,
    money_spent: 0,
  },
};

export function ComponentGetValue2(component_id: string, key: string): any {
  const result = onEvent('ComponentGetValue2', component_id, key);
  if (result !== undefined) {
    return result;
  }
  return componentValues['dummy entity'][key];
}

export function ComponentSetValue2(component: any, key: string, value: any) {
  const result = onEvent('ComponentSetValue2', component, key, value);
  if (result !== undefined) {
    return result;
  }
}

export function EntityInflictDamage(
  entityId: any,
  selfDamage: number,
  damageType: string,
  actionString: string,
  arg1: string,
  arg2: number,
  arg3: number,
  entityId2: any,
) {
  onEvent(
    'EntityInflictDamage',
    entityId,
    selfDamage,
    damageType,
    actionString,
    arg1,
    arg2,
    arg3,
    entityId2,
  );
}

export function EntityGetTransform(entity: any): [number, number] {
  const result = onEvent('EntityGetTransform', entity);
  if (result !== undefined) {
    return result;
  }
  return [0, 0];
}

export function EntityLoad(entityXml: string, x: number, y: number): number {
  const result = onEvent('EntityLoad', entityXml, x, y);
  if (result !== undefined) {
    return result;
  }
  return 0; //entity id
}

export function EntityGetAllChildren(entityId: any): any {
  const result = onEvent('EntityGetAllChildren', entityId);
  if (result !== undefined) {
    return result;
  }
  return [];
}

export function EntityGetName(childId: any): any {
  const result = onEvent('EntityGetName', childId);
  if (result !== undefined) {
    return result;
  }
  return {};
}

export function EntityHasTag(entityId: any, tag: string): any {
  const result = onEvent('EntityHasTag', entityId, tag);
  if (result !== undefined) {
    return result;
  }
  return false;
}

export function EntityGetInRadiusWithTag(
  x: number,
  y: number,
  radius: number,
  tag: string,
): any {
  const result = onEvent('EntityGetInRadiusWithTag', x, y, radius, tag);
  if (result !== undefined) {
    return result;
  }
  return {};
}

// globals
let globals: { [key: string]: string } = {};

export function GlobalsGetValue(key: string, defaultValue: string): any {
  const result = onEvent('GlobalsGetValue', key, defaultValue);
  if (result !== undefined) {
    return result;
  }
  return globals.hasOwnProperty(key) ? globals[key] : defaultValue;
}

export function GlobalsSetValue(key: string, value: string) {
  const result = onEvent('GlobalsSetValue', key, value);
  if (result !== undefined) {
    return result;
  }
  globals[key] = value;
}

export function OnActionPlayed(action_id: any) {
  const result = onEvent('OnActionPlayed', action_id);
  if (result !== undefined) {
    return result;
  }
  return false;
}

// custom

export function OnActionCalled(
  source: string,
  action: Action,
  c: GunActionState,
  ...args: number[]
) {
  const result = onEvent('OnActionCalled', source, action, c, ...args);
  if (result !== undefined) {
    return result;
  }
}

export function OnActionFinished(
  source: string,
  action: Action,
  c: GunActionState,
  returnValue: any,
  ...args: number[]
) {
  const result = onEvent(
    'OnActionFinished',
    source,
    action,
    c,
    returnValue,
    ...args,
  );
  if (result !== undefined) {
    return result;
  }
}
