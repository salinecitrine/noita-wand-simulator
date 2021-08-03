import { Gun } from './calc/extra/types';
import { ConfigState } from './redux/configSlice';

export type Wand = Gun & {
  cast_delay: number;
  mana_max: number;
  mana_charge_speed: number;
  spread: number;
};

export type Preset = {
  name: string;
  wand: Wand;
  spells: string[];
};

export type PresetGroup = {
  name: string;
  presets: (Preset | PresetGroup)[];
};

export type WandActionDragItem = {
  actionId?: string;
  sourceWandIndex?: number;
  sourceList?: ActionLocation['list'];
};

export type LocalStorageState = ConfigState;

export type ActionLocation = {
  list: 'spells' | 'permanentSpells';
  index: number;
};
