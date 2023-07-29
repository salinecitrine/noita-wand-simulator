import styled from 'styled-components';
import { Action } from '../../../calc/extra/types';
import { useAppSelector } from '../../../redux/hooks';
import { selectConfig } from '../../../redux/configSlice';

const ProxyDiv = styled.div<{
  size: number;
  imgUrl: string;
}>`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ size }) => size / 3}px;
  height: ${({ size }) => size / 3}px;
  border: 1px solid #999;
  background-image: url(/${({ imgUrl }) => imgUrl});
  background-size: cover;
  background-color: #111;
  font-family: var(--font-family-noita-default);
`;

type Props = {
  size: number;
  proxy?: Action;
};

export function ActionProxyAnnotation(props: Props) {
  const { config } = useAppSelector(selectConfig);
  if (props.proxy === undefined || !config.showProxies) {
    return null;
  }

  return <ProxyDiv size={props.size} imgUrl={props.proxy.sprite} />;
}
