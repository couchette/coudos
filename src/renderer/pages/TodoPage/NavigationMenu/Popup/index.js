import React, { useEffect, useState } from 'react';
import { Modal, Button, Input } from 'antd';

export const CreateTaskTablePopup = ({
  visible,
  setVisible,
  createTaskTableCallback,
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Modal
      title={'Create new tasktable'}
      open={visible}
      onCancel={() => {
        setVisible(false);
      }}
      footer={[
        <Button
          onClick={() => {
            setVisible(false);
          }}
        >
          {'cancel'}
        </Button>,
        <Button
          type="primary"
          onClick={() => {
            if (inputValue !== '') {
              createTaskTableCallback(inputValue);
              setInputValue('');
            }
            setVisible(false);
          }}
        >
          {'ok'}
        </Button>,
      ]}
    >
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={'New title'}
        onPressEnter={(e) => {
          if (inputValue !== '') {
            createTaskTableCallback(inputValue);
            setVisible(false);
          }
          setVisible(false);
        }}
      />
    </Modal>
  );
};
