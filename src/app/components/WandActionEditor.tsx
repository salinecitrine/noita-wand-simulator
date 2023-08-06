import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWand, setSpellAtIndex } from '../redux/wandSlice';
import { getActionById } from '../calc/eval/util';
import { WandActionDropTarget } from './wandAction/WandActionDropTarget';
import { DEFAULT_SIZE, WandAction } from './wandAction/WandAction';
// import { WandBorder } from './WandBorder';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import WandActionBorder from './wandAction/WandActionBorder';
import { Action } from '../calc/extra/types';

const StyledList = styled.ul`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  gap: 6px;
  padding: 12px 16px;
  background-color: #000;
`;

const StyledListItem = styled.li`
  display: block;
  flex: 0 1 auto;
  list-style-type: none;
`;

type Props = {};

export function WandActionEditor(props: Props) {
  const dispatch = useAppDispatch();
  const { spells } = useAppSelector(selectWand);

  const spellActions = spells.map((s) => (s ? getActionById(s) : null));

  const size = DEFAULT_SIZE;

  const handleDeleteSpell = (wandIndex: number) => {
    dispatch(setSpellAtIndex({ spell: null, index: wandIndex }));
  };

  const createActionComponent = (
    spellAction: Action | null,
    wandIndex: number,
    deckIndex: number,
  ) => {
    if (spellAction) {
      return (
        <WandActionDropTarget wandIndex={wandIndex}>
          <WandActionBorder size={size}>
            <WandActionDragSource
              actionId={spellAction.id}
              sourceWandIndex={wandIndex}
            >
              <WandAction
                action={spellAction}
                deckIndex={deckIndex}
                onDeleteSpell={() => handleDeleteSpell(wandIndex)}
              />
            </WandActionDragSource>
          </WandActionBorder>
        </WandActionDropTarget>
      );
    } else {
      return (
        <WandActionDropTarget wandIndex={wandIndex}>
          <WandActionBorder size={size} />
        </WandActionDropTarget>
      );
    }
  };

  let deckIndex = 0;
  let result: ReturnType<typeof createActionComponent>[] = [];

  spellActions.forEach((sa, index) => {
    result.push(
      <StyledListItem key={index}>
        {createActionComponent(sa, index, deckIndex)}
      </StyledListItem>,
    );
    if (sa) {
      deckIndex += 1;
    }
  });

  return <StyledList>{result}</StyledList>;
}
