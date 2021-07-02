import { RegisterGunShotEffects } from './extra/ext_functions';

export function ConfigGunShotEffects_Init(value: any) {
  value.recoil_knockback = 0;
}

export function ConfigGunShotEffects_PassToGame(value: any) {
  RegisterGunShotEffects(value.recoil_knockback);
}

//ext function
export function ConfigGunShotEffects_ReadToLua(recoil_knockback: any) {}

export function ConfigGunShotEffects_Copy(source: any, dest: any) {
  dest.recoil_knockback = source.recoil_knockback;
}
