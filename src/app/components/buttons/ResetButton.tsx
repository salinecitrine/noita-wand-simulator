import { useAppDispatch } from '../../redux/hooks';
import { setWand } from '../../redux/wandSlice';
import { defaultWand } from '../../redux/presets';
import { Button } from '../generic';

type Props = {};

export function ResetButton(props: Props) {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setWand({ wand: defaultWand, spells: [] }));
  };
  return (
    <Button
      imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
      onClick={handleClick}
    >
      Reset
    </Button>
  );
}
