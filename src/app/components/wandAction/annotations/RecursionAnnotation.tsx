import styled from 'styled-components';
import { useAppSelector } from '../../../hooks';
import { selectConfig } from '../../../redux/configSlice';

const RecursionDiv = styled.div<{
  size: number;
}>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  color: black;
  background-color: #30bfbf;
  font-size: 10px;
  line-height: ${(props) => props.size / 3 - 1}px;
  text-align: center;
`;

type Props = {
  size: number;
  recursion?: number | string;
};

export function RecursionAnnotation(props: Props) {
  const { config } = useAppSelector(selectConfig);
  if (props.recursion === undefined || !config.showRecursion) {
    return null;
  }

  return <RecursionDiv size={props.size}>{props.recursion}</RecursionDiv>;
}
