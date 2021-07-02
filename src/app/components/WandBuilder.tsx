import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import styled from 'styled-components';
import SectionHeader from './SectionHeader';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

type Props = {};

export function WandBuilder(props: Props) {
  return (
    <MainDiv>
      <SectionHeader>Wand</SectionHeader>
      <ContentDiv>
        <WandStatsEditor />
        <WandActionEditor />
      </ContentDiv>
    </MainDiv>
  );
}
