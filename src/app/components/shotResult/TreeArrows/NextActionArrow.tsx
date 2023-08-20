import styled from 'styled-components/macro';
import { Action } from '../../../calc/extra/types';
import { DEFAULT_SIZE } from '../../wandAction/WandAction';
import { ActionTreeShotResultNodeDiv } from '../../shotResult/ActionTreeShotResult';

const LineDiv = styled.div<{
  size: number;
  swept: boolean;
}>`
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  color: var(--color-arrow-action-text);
  border: 3px hidden var(--color-arrow-action);
  border-bottom-style: solid;
  border-left-style: solid;
  ${({ swept }) =>
    swept
      ? `
  top: 2.5px;
  left: -46px;
  width: 28px;
  height: 23px;
  border-radius: 12px 0 0 12px;
    `
      : `
  top: 1.5px;
  left: -50px;
  width: 32px;
  height: 24px;
  border-radius: 0 0 0 12px;
  `}

  &::before {
    position: absolute;
    content: '';
    top: 0px;
    border: 3px hidden var(--color-arrow-action-highlight);
    border-bottom-style: dotted;
    border-left-style: dotted;
    ${({ swept }) =>
      swept
        ? `
    left: -1px;
    width: 27px;
    height: 23px;
    border-radius: 15px 0 0 12px;
      `
        : `
    left: -3px;
    width: 34px;
    height: 24px;
    border-radius: 0 0 0 12px;
    `}
  }

  ${ActionTreeShotResultNodeDiv}:first-of-type > div > & {
    border-left-style: hidden;
    border-radius: 0;
  }
  ${ActionTreeShotResultNodeDiv}:first-of-type > div > &::before {
    border-left-style: hidden;
    border-radius: 0;
  }
`;

const ArrowHeadDiv = styled.div<{
  size: number;
}>`
  position: absolute;
  left: -52px;
  width: 48px;
  top: calc(50% - 8px);
  height: 16px;
  transform: translate(0px, 0);
  border: none;
  background-image: url(/data/arrowhead_right.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right center;
  image-rendering: pixelated;
`;

type Props = {
  size?: number;
  proxy?: Action;
  swept?: boolean;
};

export function NextActionArrow(props: Props) {
  const size = props.size || DEFAULT_SIZE;
  const swept = props.swept || false;

  return (
    <>
      <LineDiv size={size} swept={swept} />
      <ArrowHeadDiv size={size} />
    </>
  );
}
