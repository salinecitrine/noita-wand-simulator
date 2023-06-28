import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectPresets } from '../../redux/presetsSlice';
import { Preset } from '../../types';
import { setWand } from '../../redux/wandSlice';
import React, { useCallback, useState } from 'react';
import { WandPresetMenu } from './WandPresetMenu';
import { Button, Modal } from '../generic';

type Props = {};

export function WandPresetButton(props: Props) {
  const { presets } = useAppSelector(selectPresets);
  const dispatch = useAppDispatch();

  const [menuVisible, setMenuVisible] = useState(false);

  const handleSelect = useCallback(
    (preset: Preset) => {
      setMenuVisible(false);
      dispatch(setWand({ wand: preset.wand, spells: preset.spells }));
    },
    [dispatch],
  );

  const handleClose = () => {
    setMenuVisible(false);
  };

  return (
    <div>
      <Button
        imgUrl={'data/ui_gfx/gun_actions/heavy_bullet_unidentified.png'}
        onClick={() => setMenuVisible(!menuVisible)}
      >
        Load
      </Button>
      <Modal visible={menuVisible} onClose={handleClose} title="Presets">
        <WandPresetMenu presets={presets} onSelect={handleSelect} />
      </Modal>
    </div>
  );
}
