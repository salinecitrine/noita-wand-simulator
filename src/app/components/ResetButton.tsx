import { useAppDispatch } from '../hooks';
import { setWand } from '../redux/wandSlice';
import { defaultWand } from '../redux/presets';

type Props = {};

export function ResetButton(props: Props) {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(setWand({ wand: defaultWand, spells: [] }));
  };
  return (
    <div>
      <button onClick={handleClick}>Reset</button>
    </div>
  );
}
