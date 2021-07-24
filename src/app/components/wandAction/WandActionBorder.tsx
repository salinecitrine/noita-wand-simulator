import styled from 'styled-components';

const WandActionBorder = styled.div<{
  size: number;
}>`
  border: ${(props) => props.size / 48}px solid #555;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;

  background-color: #111;
`;

export default WandActionBorder;
