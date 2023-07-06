import re
from collections import OrderedDict

srcFile = "data/scripts/gun/gun_actions.lua"
srcFileBeta = "data/scripts/gun/gun_actions.beta.lua"
dstFile = "./src/app/calc/__generated__/entityProjectileMap.ts"
dstFileBeta = "./src/app/calc/__generated__/entityProjectileMap.beta.ts"

multiline_comment_pattern = r'--\[\[.*?]]--'
singleline_comment_pattern = r'--.*?$'

action_pattern = r'(\t+){\s*id\s*=\s*\"(\w+)\".*?\1}'
proj_pattern = r'add_projectile(?:|_trigger_hit_world|_trigger_timer|_trigger_death)\(\"([\w/.]+)\"'
related_pattern = r'related_projectiles\s*=\s*\{([\s\w/.,"]*)\}'
related_proj_pattern = r'\s*\"([\w/.]*)\"'


def processFile(srcFile, dstFile):
  with open(srcFile) as inFile:
    content = inFile.read()

  # remove comments
  content = re.sub(multiline_comment_pattern, lambda m: '', content, flags=re.DOTALL)
  content = re.sub(singleline_comment_pattern, '', content, flags=re.MULTILINE)

  exceptions = [
    'SUMMON_EGG',
    'FIREWORK',
    'WORM_RAIN'
  ]

  entity_map = dict()

  def add_entity_action(entity_path, action_id, force=False):
    if not force and action_id in exceptions:
      return

    if not entity_path.endswith('.xml'):
      print(f'warning: invalid entity path: {entity_path} ({action_id})')

    if entity_path not in entity_map:
      entity_map[entity_path] = list()

    entity_map[entity_path].append(action_id)

  projectile_mismatch_errors = []

  for action_m in re.finditer(action_pattern, content, re.DOTALL):
    action_id = action_m.group(2)

    related_projectiles = []
    for related_m in re.finditer(related_pattern, action_m.group(0)):
      for related_proj_m in re.finditer(related_proj_pattern, related_m.group(0)):
        related_projectiles.append(related_proj_m.group(1))

    match_count = 0
    for proj_m in re.finditer(proj_pattern, action_m.group(0)):
      match_count += 1
      entity_path = proj_m.group(1)
      if not entity_path in related_projectiles:
        projectile_mismatch_errors.append([action_id, entity_path, related_projectiles])

      add_entity_action(entity_path, action_id)

  print('---')
  print('These actions have projectiles added, but empty related_projectiles:')
  for mismatch in projectile_mismatch_errors:
    if len(mismatch[2]) == 0:
      print(f'{mismatch[0]}, \`{mismatch[1]}\`, {mismatch[2]}')

  print('---')
  print('These actions have projectiles that do not appear in related_projectiles:')
  for mismatch in projectile_mismatch_errors:
    if len(mismatch[2]) > 0:
      print(f'{mismatch[0]}, \`{mismatch[1]}\`, {mismatch[2]}')

  # hardcode the buggy spells which have a different related_projectile
  add_entity_action(f'data/entities/projectiles/deck/worm_rain.xml', 'WORM_RAIN', True);
  add_entity_action(f'data/entities/projectiles/deck/worm_big.xml', 'WORM_RAIN', True);

  # hardcode some dynamically generated entity paths
  for types in ['pink', 'green', 'blue', 'orange']:
    add_entity_action(f'data/entities/projectiles/deck/fireworks/firework_{types}.xml', 'FIREWORK', True)

  for types in ["monster", "slime", "red", "fire"]:
    add_entity_action(f'data/entities/items/pickup/egg_{types}.xml', 'SUMMON_EGG', True)

  lines = list()
  lines.append('export const entityToActionId: {[key: string]: string[]} = {')

  for k, vs in entity_map.items():
    v_str = ','.join([f'\'{v}\'' for v in list(OrderedDict.fromkeys(vs))])
    lines.append(f'  \'{k}\': [{v_str}],')

  lines.append('}')

  return '\n'.join(lines)

with open(dstFile, 'w') as outFile:
  outFile.write(processFiles(srcFile))

with open(dstFileBeta, 'w') as outFile:
  outFile.write(processFiles(srcFileBeta))
