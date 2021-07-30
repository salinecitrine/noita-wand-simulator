import React, { useState } from 'react';
import { Modal } from '../generic/Modal';
import { ConfigEditor } from './ConfigEditor';

type Props = {};

export function ConfigButton(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <button onClick={() => setModalVisible(!modalVisible)}>
        Configuration
      </button>
      <Modal visible={modalVisible} onClose={handleClose} title="Configuration">
        <ConfigEditor />
      </Modal>
    </div>
  );
}
