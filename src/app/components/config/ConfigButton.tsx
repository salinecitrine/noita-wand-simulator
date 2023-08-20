import React, { useState } from 'react';
import { Button, Modal } from '../generic';
import { ConfigEditor } from './ConfigEditor';

type Props = {};

export function ConfigButton(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <Button
        imgUrl={'data/sampo-config.png'}
        onClick={() => setModalVisible(!modalVisible)}
      >
        Config
      </Button>
      <Modal visible={modalVisible} onClose={handleClose} title="Configuration">
        <ConfigEditor />
      </Modal>
    </div>
  );
}
