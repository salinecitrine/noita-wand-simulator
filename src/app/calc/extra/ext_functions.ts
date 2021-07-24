import { Action, GunActionState } from './types';

// listener logic

type Callback = (eventType: string, ...args: any[]) => void;

let listeners: Callback[] = [];

export function subscribe(callback: Callback) {
  listeners.push(callback);
  return () => (listeners = listeners.filter((l) => l !== callback));
}

function onEvent(eventType: string, ...args: any[]) {
  listeners.forEach((c) => c(eventType, ...args));
}

// ext functions

export function SetProjectileConfigs() {
  onEvent('SetProjectileConfigs');
}

export function OnNotEnoughManaForAction() {
  onEvent('OnNotEnoughManaForAction');
}

export function RegisterGunShotEffects(recoil_knockback: any) {
  onEvent('RegisterGunShotEffects', recoil_knockback);
}

export function Reflection_RegisterProjectile(entity_filename: string) {
  onEvent('Reflection_RegisterProjectile', entity_filename);
}

export function BeginProjectile(entity_filename: string) {
  onEvent('BeginProjectile', entity_filename);
}

export function EndProjectile() {
  onEvent('EndProjectile');
}

export function BeginTriggerTimer(delay_frames: number) {
  onEvent('BeginTriggerTimer', delay_frames);
}

export function BeginTriggerHitWorld() {
  onEvent('BeginTriggerHitWorld');
}

export function BeginTriggerDeath() {
  onEvent('BeginTriggerDeath');
}

export function EndTrigger() {
  onEvent('EndTrigger');
}

export function BaabInstruction(name: string) {
  onEvent('BaabInstruction', name);
}

export function ActionUsesRemainingChanged(
  item_id: any,
  uses_remaining: number,
) {
  onEvent('ActionUsesRemainingChanged', item_id, uses_remaining);
  return false;
}

export function ActionUsed(item_id: any) {
  onEvent('ActionUsed', item_id);
}

export function LogAction(s: string) {
  onEvent('LogAction', s);
}

export function StartReload(reload_time: number) {
  onEvent('StartReload', reload_time);
}

export function RegisterGunAction(s: GunActionState) {
  onEvent('RegisterGunAction', s);
}

export function EntityGetWithTag(tag: string): any {
  onEvent('EntityGetWithTag', tag);
  return {};
}

export function GetUpdatedEntityID(): string {
  onEvent('GetUpdatedEntityID');
  return 'dummy entity';
}

export function EntityGetComponent(entity_id: any, component: string): any {
  onEvent('EntityGetComponent', entity_id, component);
  return {};
}

export function EntityGetFirstComponent(
  entity_id: any,
  component: string,
): any {
  onEvent('EntityGetFirstComponent', entity_id, component);
  return {};
}

export function EntityGetFirstComponentIncludingDisabled(
  entity_id: any,
  component: string,
): any {
  onEvent('EntityGetFirstComponentIncludingDisabled', entity_id, component);
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
  onEvent('ComponentGetValue2', component_id, key);
  return componentValues['dummy entity'][key];
}

export function ComponentSetValue2(component: any, key: string, value: any) {
  onEvent('ComponentSetValue2', component, key, value);
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
  onEvent('EntityGetTransform', entity);
  return [0, 0];
}

export function EntityLoad(entityXml: string, x: number, y: number): number {
  onEvent('EntityLoad', entityXml, x, y);
  return 0; //entity id
}

export function EntityGetAllChildren(entityId: any): any {
  onEvent('EntityGetAllChildren', entityId);
  return {};
}

export function EntityGetName(childId: any): any {
  onEvent('EntityGetName', childId);
  return {};
}

export function EntityHasTag(entityId: any, tag: string): any {
  onEvent('EntityHasTag', entityId, tag);
  return false;
}

export function EntityGetInRadiusWithTag(
  x: number,
  y: number,
  radius: number,
  tag: string,
): any {
  onEvent('EntityGetInRadiusWithTag', x, y, radius, tag);
  return {};
}

// globals
let globals: { [key: string]: string } = {};

export function GlobalsGetValue(key: string, defaultValue: string): any {
  return globals.hasOwnProperty(key) ? globals[key] : defaultValue;
}

export function GlobalsSetValue(key: string, value: string) {
  onEvent('GlobalsSetValue', key, value);
  globals[key] = value;
}

export function OnActionPlayed(action_id: any) {
  onEvent('OnActionPlayed', action_id);
  return false;
}

// custom

export function OnActionCalled(
  source: string,
  action: Action,
  c: GunActionState,
  ...args: number[]
) {
  onEvent('OnActionCalled', source, action, c, ...args);
}

export function OnActionFinished(
  source: string,
  action: Action,
  c: GunActionState,
  ...args: number[]
) {
  onEvent('OnActionCalled', source, action, c, ...args);
}
