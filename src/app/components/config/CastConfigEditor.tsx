import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectConfig, updateConfig } from '../../redux/configSlice';
import { WandAction } from '../wandAction/WandAction';
import { getActionById } from '../../calc/eval/util';
import styled from 'styled-components';
import { ChangeEvent } from 'react';
import SectionHeader from '../SectionHeader';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const SubSectionDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 3px;
  border: 2px solid #111;
`;

const SubSectionTitle = styled.div`
  background-color: #555;
  color: #eee;
  padding: 2px 5px 1px 5px;
`;

const InputWrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #eee;
  background-color: #111;
  padding: 1px 1px 1px 3px;

  input {
    margin-left: 2px;
    max-width: 40px;
  }
`;

type Props = {};

export function CastConfigEditor(props: Props) {
  const { config } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  const reqs = config.requirements;
  const random = config.random;

  const requirementsChangeHandler =
    (field: keyof typeof reqs) => (e: ChangeEvent<HTMLInputElement>) => {
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
      const newValue = Number.parseInt(e.target.value);
      if (!Number.isInteger(newValue)) {
        return;
      }
      dispatch(
        updateConfig({
          random: {
            ...random,
            [field]: Number.parseInt(e.target.value),
          },
        }),
      );
    };

  const handlePauseChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateConfig({
        pauseCalculations: e.target.checked,
      }),
    );
  };

  const actionSize = 24;

  return (
    <>
      <SectionHeader title={'Cast Configuration'} />
      <MainDiv>
        <SubSectionDiv>
          <SubSectionTitle>Requirements</SubSectionTitle>
          <InputWrapper>
            <WandAction action={getActionById('IF_ENEMY')} size={actionSize} />
            <input
              type="checkbox"
              checked={reqs.enemies}
              onChange={requirementsChangeHandler('enemies')}
            />
          </InputWrapper>
          <InputWrapper>
            <WandAction
              action={getActionById('IF_PROJECTILE')}
              size={actionSize}
            />
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
        </SubSectionDiv>
        <SubSectionDiv>
          <SubSectionTitle>RNG</SubSectionTitle>
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
        </SubSectionDiv>
        <SubSectionDiv>
          <SubSectionTitle>Calculation</SubSectionTitle>
          <InputWrapper>
            Pause
            <input
              type="checkbox"
              checked={config.pauseCalculations}
              onChange={handlePauseChange}
            />
          </InputWrapper>
        </SubSectionDiv>
      </MainDiv>
    </>
  );
}
