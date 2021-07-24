import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  ConfigState,
  initialState as initialConfigState,
  selectConfig,
  updateConfig,
} from '../../redux/configSlice';
import styled from 'styled-components';
import _ from 'lodash';

enum ConfigType {
  Boolean = 'boolean',
  Button = 'button',
}

type ConfigField<T> = {
  displayName: string;
  type: ConfigType;
  get: (config: ConfigState['config']) => T;
  set: (config: ConfigState['config'], v: T) => void;
};

type ConfigFieldGroup = {
  displayName: string;
  fields: (ConfigField<any> | ConfigFieldGroup)[];
};

function makeConfigField<T>(
  displayName: string,
  type: ConfigType,
  get: (config: ConfigState['config']) => T,
  set: (config: ConfigState['config'], value: T) => void,
): ConfigField<T> {
  return { displayName, type, get, set };
}

function makeConfigFieldGroup(
  displayName: string,
  fields: (ConfigField<any> | ConfigFieldGroup)[],
): ConfigFieldGroup {
  return { displayName, fields };
}

function isConfigFieldGroup(
  field: ConfigField<any> | ConfigFieldGroup,
): field is ConfigFieldGroup {
  return field.hasOwnProperty('fields');
}

const configOptions = [
  makeConfigField(
    'Condense Actions',
    ConfigType.Boolean,
    (c) => c.condenseShots,
    (c, v) => (c.condenseShots = v),
  ),
  makeConfigField(
    'Unlimited Spells',
    ConfigType.Boolean,
    (c) => c.unlimitedSpells,
    (c, v) => (c.unlimitedSpells = v),
  ),
  makeConfigField(
    'Infinite Spells',
    ConfigType.Boolean,
    (c) => c.infiniteSpells,
    (c, v) => (c.infiniteSpells = v),
  ),
  makeConfigField(
    'Show Direct Action Calls',
    ConfigType.Boolean,
    (c) => c.showDirectActionCalls,
    (c, v) => (c.showDirectActionCalls = v),
  ),
  makeConfigField(
    'Show Divides',
    ConfigType.Boolean,
    (c) => c.showDivides,
    (c, v) => (c.showDivides = v),
  ),
  makeConfigField(
    'Show Greek Spells',
    ConfigType.Boolean,
    (c) => c.showGreekSpells,
    (c, v) => (c.showGreekSpells = v),
  ),
  makeConfigField(
    'Show Deck Indexes',
    ConfigType.Boolean,
    (c) => c.showDeckIndexes,
    (c, v) => (c.showDeckIndexes = v),
  ),
  makeConfigField(
    'Show Recursion and Iteration',
    ConfigType.Boolean,
    (c) => c.showRecursion,
    (c, v) => (c.showRecursion = v),
  ),
  makeConfigField(
    'Show Projectile Proxies',
    ConfigType.Boolean,
    (c) => c.showProxies,
    (c, v) => (c.showProxies = v),
  ),
  makeConfigField(
    'Show Action Sources',
    ConfigType.Boolean,
    (c) => c.showSources,
    (c, v) => (c.showSources = v),
  ),
  makeConfigField(
    'Swap When Moving Actions',
    ConfigType.Boolean,
    (c) => c.swapOnMove,
    (c, v) => (c.swapOnMove = v),
  ),
  makeConfigField(
    'Show Action Tree',
    ConfigType.Boolean,
    (c) => c.showActionTree,
    (c, v) => (c.showActionTree = v),
  ),
  makeConfigFieldGroup('Unlocks', [
    makeConfigField(
      'Enable All',
      ConfigType.Button,
      (c) => null,
      (c, v) =>
        Object.keys(initialConfigState.config.unlocks).forEach(
          (k) => (c.unlocks[k] = true),
        ),
    ),
    makeConfigField(
      'Disable All',
      ConfigType.Button,
      (c) => null,
      (c, v) =>
        Object.keys(initialConfigState.config.unlocks).forEach(
          (k) => (c.unlocks[k] = false),
        ),
    ),
    ...Object.keys(initialConfigState.config.unlocks).map((unlockField) =>
      makeConfigField(
        unlockField
          .replace(/card_unlocked_(.*)/, '$1')
          .replace(/_/g, ' ')
          .replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }),
        ConfigType.Boolean,
        (c) => c.unlocks[unlockField],
        (c, v) => (c.unlocks[unlockField] = v),
      ),
    ),
  ]),
];

type ConfigTypeRenderer<T> = (
  key: string,
  value: T,
  update: (value: T) => void,
) => JSX.Element;

const booleanRenderer: ConfigTypeRenderer<boolean> = (name, value, update) => (
  <label>
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => update(e.target.checked)}
    />
    {name}
  </label>
);

const buttonRenderer: ConfigTypeRenderer<string> = (name, value, update) => (
  <button onClick={(e) => update(value)}>{name}</button>
);

const configRenderers: { [T in ConfigType]: ConfigTypeRenderer<any> } = {
  boolean: booleanRenderer,
  button: buttonRenderer,
};

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 10;
`;

const ConfigDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConfigSubtitle = styled.div`
  font-weight: bold;
`;

type Props = {};

export function ConfigEditor(props: Props) {
  const { config } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  const makeUpdateFunction =
    <T extends any>(set: (config: ConfigState['config'], value: T) => void) =>
    (v: T) => {
      let newConfig = _.cloneDeep(config);
      set(newConfig, v);
      dispatch(updateConfig(newConfig));
    };

  const renderConfigField = (
    field: ConfigField<any> | ConfigFieldGroup,
    showTitle = true,
  ) => {
    if (isConfigFieldGroup(field)) {
      return (
        <div>
          {showTitle && <ConfigSubtitle>{field.displayName}</ConfigSubtitle>}
          <div>
            {field.fields.map((f, index) => (
              <div key={index}>{renderConfigField(f)}</div>
            ))}
          </div>
        </div>
      );
    } else {
      const { displayName, type, get, set } = field;
      const renderer = configRenderers[type](
        displayName,
        get(config),
        makeUpdateFunction(set),
      );
      return <div>{renderer}</div>;
    }
  };

  return (
    <MainDiv>
      <ConfigDiv>
        {renderConfigField(
          {
            displayName: 'Configuration',
            fields: configOptions,
          },
          false,
        )}
      </ConfigDiv>
    </MainDiv>
  );
}
