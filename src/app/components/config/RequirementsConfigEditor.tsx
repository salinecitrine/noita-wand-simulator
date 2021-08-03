import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectConfig, updateConfig } from '../../redux/configSlice';
import { ChangeEvent } from 'react';
import { WandAction } from '../wandAction/WandAction';
import { getActionById } from '../../calc/eval/util';
import styled from 'styled-components';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CheckWrapper = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #111;
  margin-right: 5px;

  input {
    margin: 2px;
  }
`;

type Props = {};

export function RequirementsConfigEditor(props: Props) {
  const { config } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  const reqs = config.requirements;

  const changeHandler = (field: string) => (e: any) => {
    dispatch(
      updateConfig({
        requirements: {
          ...reqs,
          [field]: !reqs[field as keyof typeof reqs],
        },
      }),
    );
  };

  const actionSize = 24;

  return (
    <MainDiv>
      <CheckWrapper>
        <WandAction action={getActionById('IF_ENEMY')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.enemies}
          onChange={changeHandler('enemies')}
        />
      </CheckWrapper>
      <CheckWrapper>
        <WandAction action={getActionById('IF_PROJECTILE')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.projectiles}
          onChange={changeHandler('projectiles')}
        />
      </CheckWrapper>
      <CheckWrapper>
        <WandAction action={getActionById('IF_HP')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.hp}
          onChange={changeHandler('hp')}
        />
      </CheckWrapper>
      <CheckWrapper>
        <WandAction action={getActionById('IF_HALF')} size={actionSize} />
        <input
          type="checkbox"
          checked={reqs.half}
          onChange={changeHandler('half')}
        />
      </CheckWrapper>
    </MainDiv>
  );
}
