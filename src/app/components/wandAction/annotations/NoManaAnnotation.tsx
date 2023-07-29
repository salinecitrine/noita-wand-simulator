import styled from 'styled-components';
// import { useAppSelector } from '../../../redux/hooks';
// import { selectConfig } from '../../../redux/configSlice';

const SourceDiv = styled.div<{
  size: number;
  colors: [string, string];
}>`
  pointer-events: none;
  position: absolute;
  top: 10%;
  left: -${(props) => props.size / 4 + 12}px;
  width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
  border: 1px solid #999;
  border: none;
  background-image: url(/data/warnings/icon_warning.png);
  color: ${(props) => props.colors[0]};
  background-color: ${(props) => props.colors[1]};
  background-color: transparent;
  font-size: 12px;
  line-height: ${(props) => props.size / 3 - 2}px;
  text-align: center;
  font-family: var(--font-family-noita-default);
  opacity: 0;
`;

type Props = {
  size: number;
};

export function NoManaAnnotation(props: Props) {
  // const { config } = useAppSelector(selectConfig);
  return <SourceDiv size={props.size} colors={['#000', '#fff']}></SourceDiv>;
}
