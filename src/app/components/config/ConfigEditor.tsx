import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  ConfigState,
  selectConfig,
  updateConfig,
} from '../../redux/configSlice';
import styled from 'styled-components';
import SectionHeader from '../SectionHeader';
import { CloseButton } from '../generic/CloseButton';

enum ConfigType {
  Boolean = 'boolean',
}

const configOptions: Record<
  keyof ConfigState['config'],
  { type: ConfigType; displayName: string }
> = {
  condenseShots: { type: ConfigType.Boolean, displayName: 'Condense Actions' },
  unlimitedSpells: {
    type: ConfigType.Boolean,
    displayName: 'Unlimited Spells',
  },
  infiniteSpells: { type: ConfigType.Boolean, displayName: 'Infinite Spells' },
  showDirectActionCalls: {
    type: ConfigType.Boolean,
    displayName: 'Hide Direct Action Calls',
  },
  showDivides: { type: ConfigType.Boolean, displayName: 'Hide Divides' },
  showDeckIndexes: {
    type: ConfigType.Boolean,
    displayName: 'Show Deck Indexes',
  },
  showProxies: { type: ConfigType.Boolean, displayName: 'Show Proxies' },
  showSources: { type: ConfigType.Boolean, displayName: 'Show Sources' },
  swapOnMove: { type: ConfigType.Boolean, displayName: 'Swap on Move' },
};

type ConfigRenderer<T> = (
  key: string,
  value: T,
  update: (value: T) => void
) => JSX.Element;

const booleanRenderer: ConfigRenderer<boolean> = (name, value, update) => (
  <label>
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => update(e.target.checked)}
    />
    {name}
  </label>
);

const configRenderers = {
  boolean: booleanRenderer,
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

type Props = {};

export function ConfigEditor(props: Props) {
  const { config } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  return (
    <MainDiv>
      <ConfigDiv>
        {Object.entries(configOptions).map(
          ([k, { type, displayName }], index) => {
            const kt = k as keyof ConfigState['config'];
            const c = configRenderers[type](displayName, config[kt], (v) =>
              dispatch(updateConfig({ [kt]: v }))
            );
            return <div key={index}>{c}</div>;
          }
        )}
      </ConfigDiv>
    </MainDiv>
  );
}
