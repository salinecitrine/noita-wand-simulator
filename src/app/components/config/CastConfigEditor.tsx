import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectConfig, updateConfig } from '../../redux/configSlice';
import { WandAction } from '../wandAction/WandAction';
import { getActionById } from '../../calc/eval/util';
import styled from 'styled-components';
import { ChangeEvent } from 'react';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #555;
`;

const InputWrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #111;
  margin-right: 5px;
  color: #eee;

  input {
    margin: 2px;
    max-width: 40px;
  }
`;

type Props = {};

export function CastConfigEditor(props: Props) {
  const { config } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  const reqs = config.requirements;
  const random = config.random;

  const requirementsChangeHandler = (field: keyof typeof reqs) => (e: any) => {
    dispatch(
      updateConfig({
        requirements: {
          ...reqs,
          [field]: !reqs[field],
        },
      }),
    );
  };

  const randomChangeHandler =
    (field: keyof typeof random) => (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateConfig({
          random: {
            ...random,
            [field]: Number.parseInt(e.target.value),
          },
        }),
      );
    };

  const actionSize = 24;

  return (
    <MainDiv>
      <InputWrapper>
        <WandAction action={getActionById('IF_ENEMY')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.enemies}
          onChange={requirementsChangeHandler('enemies')}
        />
      </InputWrapper>
      <InputWrapper>
        <WandAction action={getActionById('IF_PROJECTILE')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.projectiles}
          onChange={requirementsChangeHandler('projectiles')}
        />
      </InputWrapper>
      <InputWrapper>
        <WandAction action={getActionById('IF_HP')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.hp}
          onChange={requirementsChangeHandler('hp')}
        />
      </InputWrapper>
      <InputWrapper>
        <WandAction action={getActionById('IF_HALF')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.half}
          onChange={requirementsChangeHandler('half')}
        />
      </InputWrapper>
      <InputWrapper>
        World Seed
        <input
          type="number"
          value={config.random.worldSeed}
          onChange={randomChangeHandler('worldSeed')}
          min={0}
          max={1000}
        />
      </InputWrapper>
      <InputWrapper>
        Frame #
        <input
          type="number"
          value={config.random.frameNumber}
          onChange={randomChangeHandler('frameNumber')}
          min={0}
          max={1000}
        />
      </InputWrapper>
    </MainDiv>
  );
}
