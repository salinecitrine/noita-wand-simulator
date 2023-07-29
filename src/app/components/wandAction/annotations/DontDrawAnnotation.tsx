import styled from 'styled-components';
import { useAppSelector } from '../../../redux/hooks';
import { selectConfig } from '../../../redux/configSlice';

const DontDrawDiv = styled.div<{
  size: number;
}>`
  pointer-events: none;
  position: absolute;
  top: -3px;
  top: 50%;
  transform: translateY(-50%);
  right: -${(props) => props.size / 4 + 12}px;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #c55;
  font-size: 12px;
  line-height: ${(props) => props.size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
`;

type Props = {
  size: number;
  dontDrawActions?: boolean;
};

export function DontDrawAnnotation(props: Props) {
  const { config } = useAppSelector(selectConfig);
  if (!props.dontDrawActions || !config.showDontDraw) {
    return null;
  }

  return <DontDrawDiv size={props.size}>D</DontDrawDiv>;
}
