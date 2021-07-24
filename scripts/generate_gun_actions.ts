export {};

const srcFile = 'data/scripts/gun/gun_actions.lua';
const dstFile = 'src/app/calc/__generated__/gun_actions.ts';

const imports = `
import {GunActionState, Action} from "../extra/types";
import {
  ACTION_TYPE_PROJECTILE,
  ACTION_TYPE_STATIC_PROJECTILE,
  ACTION_TYPE_MODIFIER,
  ACTION_TYPE_DRAW_MANY,
  ACTION_TYPE_MATERIAL,
  ACTION_TYPE_OTHER,
  ACTION_TYPE_UTILITY,
  ACTION_TYPE_PASSIVE,
} from "../gun_enums";
import {
  hand,
  deck,
  discarded,
  shot_effects,
  current_reload_time,
  setCurrentReloadTime,
  mana,
  setMana,
  setDontDrawActions,
  force_stop_draws,
  setForceStopDraws,
  clearDiscarded,
  clearHand,
  clearDeck,
  add_projectile,
  add_projectile_trigger_hit_world,
  add_projectile_trigger_timer,
  add_projectile_trigger_death,
  draw_actions,
  check_recursion,
  ACTION_DRAW_RELOAD_TIME_INCREASE,
  move_discarded_to_deck,
  order_deck,
  reflecting,
  call_action,
} from "../gun";
import {
  EntityGetWithTag,
  GetUpdatedEntityID,
  EntityGetComponent,
  EntityGetFirstComponent,
  ComponentGetValue2,
  ComponentSetValue2,
  EntityInflictDamage,
  ActionUsesRemainingChanged,
  EntityGetTransform,
  EntityLoad,
  EntityGetAllChildren,
  EntityGetName,
  EntityHasTag,
  EntityGetFirstComponentIncludingDisabled,
  EntityGetInRadiusWithTag,
  GlobalsGetValue,
  GlobalsSetValue,
} from "../extra/ext_functions";
import { Random } from "../extra/util";
import { ActionSource } from "../eval/types";


`;

const bracketArrayPattern = /actions =\s*{(.*)}/gms;
const bracketArrayReplace = 'export const actions: Action[] = [$1]';

const multiLineCommentPattern = /--\[\[.*?]]--/gms;
const singleLineCommentPattern = /--.*?$/gm;

const relatedPattern = /related_(\w+)\s*=\s*{(.*?)},/gm;
const relatedReplace = 'related_$1=[$2],';

const propertiesPattern = /^(\s*\w+)\s*=\s*(.*), *$/gm;
const propertiesReplace = '$1: $2,';

const actionPattern = /action\s*=\s*function\((.*?)\)(\s*)(.*?)end,(\s*},)/gms;

const syntaxPatterns = [
  {
    pattern: /if\s+(.*?)\s+and\s+(.*?)\s+then/gm,
    replace: 'if ($1 && $2) then',
  },
  { pattern: /local /gm, replace: 'let ' },
  { pattern: /#(\w+)/gm, replace: '$1.length' },
  { pattern: /elseif/gm, replace: '} else if' },
  { pattern: /(\selse)(?!\w)(?! +if)/gm, replace: '} $1 {' },
  { pattern: /if\s+([^()]+?)then/gm, replace: 'if ($1) {' },
  { pattern: /if\s+(.+?)then/gm, replace: 'if $1 {' },
  { pattern: /end(\s+)/gm, replace: '}$1' },
  { pattern: /(\w+)\s*=\s*{(.*?)}/gm, replace: '$1 = [$2]' },
  {
    pattern: /current_reload_time = (.*?)$/gm,
    replace: 'setCurrentReloadTime($1)',
  },
  { pattern: /mana = (.*?)$/gm, replace: 'setMana($1)' },
  {
    pattern: /dont_draw_actions = (.*?)$/gm,
    replace: 'setDontDrawActions($1)',
  },
  { pattern: /force_stop_draws = (.*?)$/gm, replace: 'setForceStopDraws($1)' },
  { pattern: /discarded = \[]$/gm, replace: 'clearDiscarded()' },
  { pattern: /hand = \[]$/gm, replace: 'clearHand()' },
  { pattern: /deck = \[]$/gm, replace: 'clearDeck()' },
  { pattern: / \.\. "/gm, replace: ' + "' },
  { pattern: /" \.\. /gm, replace: '" + ' },
  { pattern: /math\./gm, replace: 'Math.' },
  { pattern: /(SetRandomSeed\(.*?\))$/gm, replace: '// $1' },
  { pattern: /tostring\((.*?)\)/gm, replace: 'String($1)' },
  {
    pattern: /for (\w+)=(.+?),(.+?) do/gm,
    replace: 'for (let $1 = $2; $1 <= $3; $1++) {',
  },
  { pattern: /while (.*?) do/gm, replace: 'while ($1) {' },
  { pattern: /~=/gm, replace: '!==' },
  { pattern: /(?<=\W)nil(?=\W)/gm, replace: 'null' },
  { pattern: / and /gm, replace: ' && ' },
  { pattern: / or /gm, replace: ' || ' },
  { pattern: /if \(?\s*not (.*?)\s*\)? {/gm, replace: 'if (!$1) {' },
  {
    pattern: /(data\d?|v).action\((.*?)\)/gm,
    replace: 'call_action(ActionSource.ACTION, $1, c, $2)',
  },
  { pattern: /let (\w+)\s*,\s*(\w+) =/gm, replace: 'let [$1, $2] =' },
  { pattern: /let (data) = \[]/gm, replace: 'let $1: Action | null = null' },
  { pattern: /let (\w+) = \[]/gm, replace: 'let $1: any = []' },
  {
    pattern: /table.insert\(\s*(\w+)\s*,\s*(\w+)\s*\)/gm,
    replace: '$1.push($2)',
  },
  {
    pattern: /table.remove\(\s*(\w+)\s*,\s*(\w+)\s*\)/gm,
    replace: '$1.splice($2 - 1, 1)',
  },
  {
    pattern: /(deck|actions|hand|discarded|types)\[([\w.]+)]/gm,
    replace: '$1[$2 - 1]',
  },
  {
    pattern: /string.sub\((.*?),(.*?),(.*?)\)/gm,
    replace: '$1.substring($2-1,$3)',
  },
  { pattern: /tonumber\(/gm, replace: 'Number.parseInt(' },
  {
    pattern: /(\t+)for (\w+),(\w+) in ipairs\(\s*(.+?)\s*\) do(.*?)^\1}/gms,
    replace:
      '$1for(let $2 = 0; $2 < $4.length; $2++) {\n$1\tconst $3 = $4[$2];\n$5$1}',
    repeat: true,
  },
  { pattern: / == /gm, replace: ' === ' },
  { pattern: / !== null/gm, replace: ' != null' },
  { pattern: / === null/gm, replace: ' == null' },
  { pattern: /related_projectiles\[1\]/gm, replace: 'related_projectiles[0]' },
  { pattern: /related_projectiles\[2\]/gm, replace: 'related_projectiles[1]' },
  // {
  //   // fix typo
  //   pattern:
  //     /(sprite: ".*?vacuum_entities.*?related_projectiles: \[".*?)vacuum_liquid/gms,
  //   replace: '$1vacuum_entities',
  // },
  // {
  //   // fix typo
  //   pattern:
  //     /related_projectiles: \["data\/entities\/projectiles\/deck\/darkflame.xml"\],/gms,
  //   replace:
  //     'related_projectiles: ["data/entities/projectiles/darkflame.xml"],',
  // },
];

let content = Deno.readTextFileSync(srcFile);

// fix array syntax for top level actions
content = content.replaceAll(bracketArrayPattern, bracketArrayReplace);

// remove comments
content = content.replaceAll(multiLineCommentPattern, '');
content = content.replaceAll(singleLineCommentPattern, '');

// fix array syntax for related projectiles
content = content.replaceAll(relatedPattern, relatedReplace);

// convert object fields to ts
content = content.replaceAll(propertiesPattern, propertiesReplace);

// convert action function to ts+commented lua
// action\s*=\s*function\((.*?)\)(\s*)(.*?)end,(\s*},)
// action: (c: C, $1) => {$2$3},$4
const actionArgTypes: { [key: string]: [string, any] } = {
  recursion_level: ['number', 0],
  iteration: ['number', 1],
};
content = content.replaceAll(actionPattern, (match: string, ...g: string[]) => {
  let argsString = 'c: GunActionState';
  let extraArgs = g[0].split(',').map((s) => s.trim());
  extraArgs.forEach((arg) => {
    if (!arg) {
      return;
    }
    const a = actionArgTypes[arg];
    argsString += `, ${arg}: ${a[0]} = ${a[1]}`;
  });
  return `action: (${argsString}) => {${g[1]}${g[2]}},${g[3]}`;
});

syntaxPatterns.forEach(({ pattern, replace, repeat = false }) => {
  content = content.replaceAll(pattern, replace);
  if (repeat) {
    let oldContent = '';
    while (oldContent !== content) {
      oldContent = content;
      content = content.replaceAll(pattern, replace);
    }
  }
});

// insert imports
content = imports + content;

Deno.mkdirSync(dstFile.substring(0, dstFile.lastIndexOf('/')), {
  recursive: true,
});

// Deno.writeTextFileSync(dstFile, content);
Deno.writeTextFileSync(dstFile, content);
