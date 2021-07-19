import styled from 'styled-components';
import { Action } from '../../../calc/extra/types';
import { useAppSelector } from '../../../hooks';
import { selectConfig } from '../../../redux/configSlice';

const ProxyDiv = styled.div<{
  size: number;
  imgUrl: string;
}>`
  position: absolute;
  top: 0;
  right: 0;
  width: ${(props) => props.size / 3}px;
  height: ${(props) => props.size / 3}px;
  border: 1px solid #999;
  background-image: url(${(props) => props.imgUrl});
  background-size: cover;
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
