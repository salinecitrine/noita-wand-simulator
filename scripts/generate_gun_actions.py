import os
import re
from dataclasses import dataclass
from re import Match

srcFile = 'data/scripts/gun/gun_actions.lua'
srcFileBeta = 'data/scripts/gun/gun_actions.beta.lua'
dstFile = 'src/app/calc/__generated__/gun_actions.ts'
dstFileBeta = 'src/app/calc/__generated__/gun_actions.beta.ts'

os.makedirs(os.path.dirname(dstFile), exist_ok=True)

imports = """
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
import { Random, SetRandomSeed, GameGetFrameNum } from "../extra/util";
import { ActionSource } from "../eval/types";

"""

lua_utils = """
function* luaFor(start: number, count: number, step: number = 1) {
  let cur = start, n = count;
  while (--n >= 0) {
    yield cur += step;
  }
}

function* ipairs([...arr]) {
  const len = arr.length;
  let i = -1;
  while (++i < len) {
    yield [i, arr[i]];
  }
}

"""


@dataclass
class PatternReplace:
  pattern: str
  replace: str = ''
  flags: int = 0
  repeat: bool = False


# m = flags=re.MULTILINE
# s = re.DOTALL

bracketArrayPattern = PatternReplace(
  r'actions =\s*{(.*)}',
  r'export const actions: Action[] = [\1]',
  flags=re.DOTALL,
)

multiLineCommentPattern = PatternReplace(r'--\[\[.*?]]--', flags=re.MULTILINE | re.DOTALL)
singleLineCommentPattern = PatternReplace(r'--.*?$', flags=re.MULTILINE)

relatedPattern = PatternReplace(r'related_(\w+)\s*=\s*{(.*?)},', r'related_\1=[\2],', flags=re.MULTILINE)

propertiesPattern = PatternReplace(r'^(\s*\w+)\s*=\s*(.*), *$', r'\1: \2,', flags=re.MULTILINE)

actionPattern = PatternReplace(r'action\s*=\s*function\((.*?)\)(\s*)(.*?)end,(\s*},)', flags=re.MULTILINE | re.DOTALL)

syntaxPatterns = [
  PatternReplace(r'if\s+(.*?)\s+and\s+(.*?)\s+then', r'if (\1 && \2) then', flags=re.MULTILINE),
  PatternReplace(r'local ', r'let ', flags=re.MULTILINE),
  PatternReplace(r'#(\w+)', r'\1.length', flags=re.MULTILINE),
  PatternReplace(r'elseif', r'} else if', flags=re.MULTILINE),
  PatternReplace(r'(\t+)(else)(?!\w)(?! +if)', r'\1} \2 {', flags=re.MULTILINE),
  PatternReplace(r'if\s+([^()]+?)then', r'if (\1) {', flags=re.MULTILINE),
  PatternReplace(r'if\s+(.+?)then', r'if \1 {', flags=re.MULTILINE),
  PatternReplace(r'end(\s+)', r'}\1', flags=re.MULTILINE),
  PatternReplace(r'(\w+)\s*=\s*{(.*?)}', r'\1 = [\2]', flags=re.MULTILINE),
  PatternReplace(r'current_reload_time = (.*?)$', r'setCurrentReloadTime(\1)', flags=re.MULTILINE),
  PatternReplace(r'mana = (.*?)$', r'setMana(\1)', flags=re.MULTILINE),
  PatternReplace(r'dont_draw_actions = (.*?)$', r'setDontDrawActions(\1)', flags=re.MULTILINE),
  PatternReplace(r'force_stop_draws = (.*?)$', r'setForceStopDraws(\1)', flags=re.MULTILINE),
  PatternReplace(r'discarded = \[]$', r'clearDiscarded()', flags=re.MULTILINE),
  PatternReplace(r'hand = \[]$', r'clearHand()', flags=re.MULTILINE),
  PatternReplace(r'deck = \[]$', r'clearDeck()', flags=re.MULTILINE),
  PatternReplace(r' \.\. "', r' + "', flags=re.MULTILINE),
  PatternReplace(r'" \.\. ', r'" + ', flags=re.MULTILINE),
  PatternReplace(r'math\.', r'Math.', flags=re.MULTILINE),
  # PatternReplace(r'(SetRandomSeed\(.*?\))$', r'// \1', flags=re.MULTILINE),
  PatternReplace(r'tostring\((.*?)\)', r'String(\1)', flags=re.MULTILINE),
  # PatternReplace(r'for (\w+)=(.+?),(.+?) do', r'for (let \1 = \2; \1 <= \3; \1++) {', flags=re.MULTILINE),
  PatternReplace(r'while (.*?) do', r'while (\1) {', flags=re.MULTILINE),
  PatternReplace(r'~=', r'!==', flags=re.MULTILINE),
  PatternReplace(r'(?<=\W)nil(?=\W)', r'null', flags=re.MULTILINE),
  PatternReplace(r' and ', r' && ', flags=re.MULTILINE),
  PatternReplace(r' or ', r' || ', flags=re.MULTILINE),
  PatternReplace(r'if \(?\s*not (.*?)\s*\)? {', r'if (!\1) {', flags=re.MULTILINE),
  PatternReplace(r'(data\d?|v).action\((.*?)\)', r'call_action(ActionSource.ACTION, \1, c, \2)', flags=re.MULTILINE),
  PatternReplace(r'let (\w+)\s*,\s*(\w+) =', r'let [\1, \2] =', flags=re.MULTILINE),
  PatternReplace(r'let (data) = \[]', r'let \1: Action | null = null', flags=re.MULTILINE),
  PatternReplace(r'let (\w+) = \[]', r'let \1: any = []', flags=re.MULTILINE),

  PatternReplace(r'table.insert\(\s*(\w+)\s*,\s*(\w+)\s*\)', r'\1.push(\2)', flags=re.MULTILINE),
  PatternReplace(r'table.remove\(\s*(\w+)\s*,\s*(\w+)\s*\)', r'\1.splice(\2 - 1, 1)', flags=re.MULTILINE),
  PatternReplace(r'(deck|actions|hand|discarded|types)\[([\w.\- ]+)]', r'\1[\2 - 1]', flags=re.MULTILINE),
  PatternReplace(r'string.sub\((.*?),(.*?),(.*?)\)', r'\1.substring(\2-1,\3)', flags=re.MULTILINE),
  PatternReplace(r'tonumber\(', r'Number.parseInt(', flags=re.MULTILINE),

  # For loops
  #   for i=1,how_many[,step] do  ==>  for (const i of luaFor(1, how_many[, step])) {
  PatternReplace(
    r'for *(.*?) *= *(.*?) *, *(.*?) *, *(.*?) +do',
    r'for (const \1 of luaFor(\2, \3, \4)) {',
    flags=re.MULTILINE,
    # repeat=True,
  ),
  #          for i=1,how_many do  ==>  for (const i of luaFor(1, how_many)) {
  PatternReplace(
    r'for *(.*?) *= *(.*?) *, *(.*?) +do',
    r'for (const \1 of luaFor(\2, \3)) {',
    flags=re.MULTILINE,
    # repeat=True,
  ),
  # for i,v in ipairs( list ) do  ==>  for (const [i, v] of ipairs(list)) {
  PatternReplace(
    r'for ([.()\-\w]+),(\w+) in ipairs\(\s*(.+?)\s*\) do',
    r'for (const [\1, \2] of ipairs(\3)) {',
    flags=re.MULTILINE,
    # repeat=True,
  ),

  PatternReplace(r' == ', r' === ', flags=re.MULTILINE),
  PatternReplace(r' !== null', r' != null', flags=re.MULTILINE),
  PatternReplace(r' === null', r' == null', flags=re.MULTILINE),
  PatternReplace(r'related_projectiles\[1\]', r'related_projectiles[0]', flags=re.MULTILINE),
  PatternReplace(r'related_projectiles\[2\]', r'related_projectiles[1]', flags=re.MULTILINE),
  PatternReplace(r'(?<!let )((?:end|else)point = i)', r'\1 + 1', flags=re.MULTILINE),
  PatternReplace(r'i <= hand_count', r'i < hand_count', flags=re.MULTILINE),
]

# convert action function to ts+commented lua
# action\s*=\s*function\((.*?)\)(\s*)(.*?)end,(\s*},)
# action: (c: C, \1) => {\1\1},\1
actionArgTypes = {
  'recursion_level': ['number', 0],
  'iteration': ['number', 1],
}

def actionReplaceFn(m: Match):
  argsString = 'c: GunActionState'
  extraArgs = [s.strip() for s in m.group(1).split(',')]
  for arg in extraArgs:
    if arg is None or len(arg) == 0:
      break
    a = actionArgTypes[arg]
    argsString += f', {arg}: {a[0]} = {a[1]}'

  return f'action: ({argsString}) => {{{m.group(2)}{m.group(3)}}},{m.group(4)}'


def processFile(srcFile):
  with open(srcFile) as inFile:
    content = inFile.read()

  # fix array syntax for top level actions
  content = re.sub(bracketArrayPattern.pattern, bracketArrayPattern.replace, content, flags=bracketArrayPattern.flags)

  # remove comments
  content = re.sub(
    multiLineCommentPattern.pattern,
    multiLineCommentPattern.replace, content,
    flags=multiLineCommentPattern.flags
  )
  content = re.sub(
    singleLineCommentPattern.pattern,
    singleLineCommentPattern.replace, content,
    flags=singleLineCommentPattern.flags
  )

  # fix array syntax for related projectiles
  content = re.sub(relatedPattern.pattern, relatedPattern.replace, content, flags=relatedPattern.flags)

  # convert object fields to ts
  content = re.sub(propertiesPattern.pattern, propertiesPattern.replace, content, flags=propertiesPattern.flags)

  content = re.sub(actionPattern.pattern, actionReplaceFn, content, flags=actionPattern.flags)

  for pattern in syntaxPatterns:
    content = re.sub(pattern.pattern, pattern.replace, content, flags=pattern.flags)
    if pattern.repeat:
      oldContent = ''
      while oldContent != content:
        oldContent = content
        content = re.sub(pattern.pattern, pattern.replace, content, flags=pattern.flags)

  # insert imports & lua utils
  content = imports + lua_utils + content

  return content


with open(dstFile, 'w') as outFile:
  outFile.write(processFile(srcFile))

with open(dstFileBeta, 'w') as outFile:
  outFile.write(processFile(srcFileBeta))
