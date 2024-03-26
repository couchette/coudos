import React, { useState, useRef } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Modal, message, Upload } from 'antd';

export const UploadFilePopup = ({ visible, setVisible, setDataCallback }) => {
  const { Dragger } = Upload;
  const [inputValue, setInputValue] = useState('');
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const result = reader.result;
      setFile(result);
    };
    return false;
  };

  const handleChange = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-2);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  return (
    <Modal
      title={'Upload Plan'}
      visible={visible}
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
        <Popconfirm
          title={
            'Uploading this file will overwrite existing data. Are you sure you want to continue?'
          }
          onConfirm={() => {
            if (file) {
              setDataCallback(JSON.parse(file));
              setFile(null);
              setFileList([]);
              setVisible(false);
            }
          }}
        >
          <Button type="primary">{'OK'}</Button>
        </Popconfirm>,
      ]}
    >
      <Dragger
        fileList={fileList}
        beforeUpload={beforeUpload}
        accept=".json"
        onChange={handleChange}
        maxCount={1}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
      <p>{}</p>
    </Modal>
  );
};
