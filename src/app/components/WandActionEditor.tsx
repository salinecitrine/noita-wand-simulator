import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWand, setSpellAtIndex } from '../redux/wandSlice';
import { getActionById } from '../calc/eval/util';
import { WandActionDropTarget } from './wandAction/WandActionDropTarget';
import { WandAction } from './wandAction/WandAction';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import WandActionBorder from './wandAction/WandActionBorder';
import { Action } from '../calc/extra/types';

const StyledList = styled.ul`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
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

  const size = 48;

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
          <WandActionDragSource
            actionId={spellAction.id}
            sourceWandIndex={wandIndex}
          >
            <WandActionBorder size={size}>
              <WandAction
                action={spellAction}
                deckIndex={deckIndex}
                onDeleteSpell={() => handleDeleteSpell(wandIndex)}
              />
            </WandActionBorder>
          </WandActionDragSource>
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
