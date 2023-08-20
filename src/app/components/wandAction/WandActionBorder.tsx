import styled from 'styled-components';

const WandActionBorder = styled.div<{
  size: number;
}>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: ${({ size }) => size * 0.0625}px;
  background-image: url(/data/inventory/full_inventory_box.png);
  background-size: cover;
  image-rendering: pixelated;
`;

export default WandActionBorder;
