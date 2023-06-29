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
  flex-wrap: wrap;
  align-items: stretch;
  padding: 1px;

  @media screen and (max-width: 400px) {
  }
`;

const SubSectionDiv = styled.div<{}>`
  display: flex;
  flex: 1 0 48%;
  flex-wrap: wrap;
  justify-content: start;
  align-items: stretch;
  margin: 0px;
  min-height: 2.3em;
  border: 2px solid #232323;
  background-color: #111;
  background-color: #111;
  border-top-color: var(--config-topleft-border);
  border-left-color: var(--config-topleft-border);
  border-bottom-color: var(--config-bottomright-border);
  border-right-color: var(--config-bottomright-border);
`;

const SubSectionTitle = styled.div<{
  minWidth?: string;
}>`
  display: flex;
  align-items: center;
  background-color: #000;
  color: #eee;
  padding: 2px 6px 2px 4px;
  font-family: 'noita', '04b03', sans-serif;
  font-size: 14px;
  ${({ minWidth }) => `min-width: ${minWidth ?? '6em'};`}
  justify-content: space-evenly;

  span {
    padding-top: 2px;
  }
`;

const SubSectionContent = styled.div<{
  wrapq?: boolean;
  maxWidth?: string;
}>`
  ${({ wrapq = false }) => (wrapq ? 'flex-wrap: wrap;' : '')}
  display: flex;
  align-items: center;
  background-color: #000;
  margin-right: 4px;
  flex: 1 1;
  width: 100%;
  ${({ maxWidth }) => (maxWidth ? `max-width: ${maxWidth};` : '')}
  gap: 0.2em;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  flex-wrap: nowrap;
  flex: 0 1 auto;
  background-color: #222;
  border: var(--input-border);
  border-radius: var(--input-border-radius);
  margin: 0;
  padding: 3px 3px 3px 2px;
  cursor: pointer;

  span {
    align-self: center;
    margin: 0 0 0 5px;
    padding-top: 2px;
  }
`;

const InputWrapper = styled.label`
  display: flex;
  align-items: center;
  color: #eee;
  background-color: #111;
  padding: 1px 1px 1px 3px;
  flex: 1 1 auto;

  input[type='text'],
  input[type='number'] {
    margin: 0 1px 0 5px;
    min-width: 4em;
    max-width: 100%;
    width: 100%;
    flex: 1 1 100%;
    background-color: #222;
    border: var(--input-border);
    border-radius: var(--input-border-radius);
    font-family: 'noita', '04b03', sans-serif;
    font-size: 14px;
    color: #fff;
    text-align: center;
    padding: 5px 0 3px 0;
  }

  input[type='text']:focus-visible,
  input[type='number']:focus-visible {
    border: 2px solid #c89e3adb;
    outline: 1px solid #bf8d10cf;
    border: 2px solid #d0ba43;
    outline: 1px solid #dea71bcf;
    background-color: #000;
    outline-style: dashed;
    border-style: inset;
  }

  input[type='checkbox'] {
    margin: 0 6px 0 5px;
  }

  font-family: 'noita', '04b03', sans-serif;
  font-size: 14px;
`;

const CheckboxInputWrapper = styled(InputWrapper)`
  flex: 0;
`;

const RandomInputWrapper = styled(InputWrapper)`
  flex: 1 1 46%;
  justify-content: space-evenly;
  width: 100%;

  input[type='text'] {
    min-width: 4em;
  }
  span {
    min-width: 3.5em;
    text-align: right;
  }
`;

// const SimPaused = styled.span`
//   display: inline-block;
//   width: 4em;
//   padding-left: 4px;
//   font-style: italic;
// `;
// const SimRunning = styled.span`
//   display: inline-block;
//   width: 4em;
//   padding-left: 4px;
// `;

const InputImageLabel = styled.div<{
  size: number;
  imgUrl: string;
  leftMargin?: string;
}>`
  position: relative;
  background-color: #111;
  min-width: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-size: cover;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  image-rendering: pixelated;
  margin: 0 4px 0 ${({ leftMargin }) => (leftMargin ? leftMargin : '2px')};
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

  const numberChangeHandler =
    (field: keyof typeof config) => (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = Number.parseInt(e.target.value);
      if (!Number.isInteger(newValue)) {
        return;
      }
      dispatch(
        updateConfig({
          [field]: Number.parseInt(e.target.value),
        }),
      );
    };

  const handleConfigToggle =
    (field: keyof typeof config) => (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateConfig({
          [field]: e.target.checked,
        }),
      );
    };

  const actionSize = 24;

  return (
    <>
      <SectionHeader title={'Cast Config'} />
      <MainDiv>
        <SubSectionDiv>
          <SubSectionTitle>
            <InputImageLabel size={24} imgUrl={'data/config/heart2.png'} />
            <span>Health:</span>
          </SubSectionTitle>
          <SubSectionContent>
            <CheckboxInputWrapper>
              <CheckboxWrapper>
                <input
                  type="checkbox"
                  checked={config.infiniteHp}
                  onChange={handleConfigToggle('infiniteHp')}
                />
                <span>∞</span>
              </CheckboxWrapper>
            </CheckboxInputWrapper>
            <InputWrapper>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={config.var_hp}
                onChange={numberChangeHandler('var_hp')}
              />
            </InputWrapper>
            {/* <InputWrapper> */}
            {/*   / */}
            {/*   <input */}
            {/*     type="text" */}
            {/*     inputMode="numeric" */}
            {/*     pattern="^[1-9][0-9]*$" */}
            {/*     value={config.var_hp_max} */}
            {/*     onChange={numberChangeHandler('var_hp_max')} */}
            {/*   /> */}
            {/* </InputWrapper> */}
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv>
          <SubSectionTitle>
            <InputImageLabel size={20} imgUrl={'data/config/goldnugget2.png'} />
            <span>Money:</span>
          </SubSectionTitle>
          <SubSectionContent>
            <CheckboxInputWrapper>
              <CheckboxWrapper>
                <input
                  type="checkbox"
                  checked={config.infiniteMoney}
                  onChange={handleConfigToggle('infiniteMoney')}
                />
                <span>∞</span>
              </CheckboxWrapper>
            </CheckboxInputWrapper>
            <InputWrapper>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={config.var_money}
                onChange={numberChangeHandler('var_money')}
              />
            </InputWrapper>
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv>
          <SubSectionTitle minWidth={'auto'}>
            <InputImageLabel
              leftMargin={'6px'}
              size={19}
              imgUrl={'data/config/die2.png'}
            />
          </SubSectionTitle>
          <SubSectionContent wrapq={true} maxWidth={'calc(100% - 2.2em)'}>
            <RandomInputWrapper>
              <span>Seed:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={config.random.worldSeed}
                onChange={randomChangeHandler('worldSeed')}
              />
            </RandomInputWrapper>
            <RandomInputWrapper>
              <span>Frame:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="^[1-9][0-9]*$"
                value={config.random.frameNumber}
                onChange={randomChangeHandler('frameNumber')}
              />
            </RandomInputWrapper>
          </SubSectionContent>
        </SubSectionDiv>
        <SubSectionDiv>
          <SubSectionTitle>
            <span>Requirements:</span>
          </SubSectionTitle>
          <SubSectionContent>
            <CheckboxInputWrapper>
              <WandAction
                action={getActionById('IF_ENEMY')}
                size={actionSize}
              />
              <input
                type="checkbox"
                checked={reqs.enemies}
                onChange={requirementsChangeHandler('enemies')}
              />
            </CheckboxInputWrapper>
            <CheckboxInputWrapper>
              <WandAction
                action={getActionById('IF_PROJECTILE')}
                size={actionSize}
              />
              <input
                type="checkbox"
                checked={reqs.projectiles}
                onChange={requirementsChangeHandler('projectiles')}
              />
            </CheckboxInputWrapper>
            <CheckboxInputWrapper>
              <WandAction action={getActionById('IF_HP')} size={actionSize} />
              <input
                type="checkbox"
                checked={reqs.hp}
                onChange={requirementsChangeHandler('hp')}
              />
            </CheckboxInputWrapper>
            <CheckboxInputWrapper>
              <WandAction action={getActionById('IF_HALF')} size={actionSize} />
              <input
                type="checkbox"
                checked={reqs.half}
                onChange={requirementsChangeHandler('half')}
              />
            </CheckboxInputWrapper>
          </SubSectionContent>
        </SubSectionDiv>
        {/* <SubSectionDiv> */}
        {/*   <SubSectionTitle>Simulation: {config.pauseCalculations ? <SimPaused>Paused</SimPaused> : <SimRunning>Running</SimRunning>}</SubSectionTitle> */}
        {/*   <SubSectionContent> */}
        {/*     <InputWrapper> */}
        {/*       <CheckboxWrapper> */}
        {/*         <input */}
        {/*           type="checkbox" */}
        {/*           checked={config.pauseCalculations} */}
        {/*           onChange={handleConfigToggle('pauseCalculations')} */}
        {/*         /> */}
        {/*       </CheckboxWrapper> */}
        {/*     </InputWrapper> */}
        {/*   </SubSectionContent> */}
        {/* </SubSectionDiv> */}
      </MainDiv>
    </>
  );
}
