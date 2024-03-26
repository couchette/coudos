import React, { useEffect, useState, useRef } from 'react';
import { Button, Row, Dropdown, Input } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';

const App: React.FC<{
  title: string;
  setTitle: (title: string) => void;
}> = ({ title, setTitle }) => {
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = useRef(null);

  const dropdownItems = [
    {
      // eslint-disable-next-line
      label: (
        <a
          onClick={(e) => {
            e.stopPropagation();
            setIsEdit(true);
          }}
        >
          Edit Title
        </a>
      ),
      key: '1',
      icon: <EditOutlined />,
    },
    {
      // eslint-disable-next-line
      label: (
        <a
          onClick={(e) => {
            e.stopPropagation();
            setTitle(null);
          }}
        >
          Delete
        </a>
      ),
      key: '3',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  useEffect(() => {
    // Effect to focus on the input when editingItem becomes 'edit'
    if (isEdit === true && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  return (
    <Row align={'middle'}>
      {isEdit ? (
        <Input
          defaultValue={String(title)}
          onPressEnter={(e) => {
            setTitle(e.target.value);
            setIsEdit(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onBlur={(e) => {
            setTitle(e.target.value);
            setIsEdit(false);
          }}
          ref={inputRef}
        />
      ) : (
        <>
          <div
            style={{ position: 'absolute', left: '10px', marginRight: '5px' }}
          >
            {String(title)}
          </div>
          <Dropdown
            menu={{ items: dropdownItems }}
            trigger={['click']}
            placement="bottom"
            arrow
          >
            <Button style={{ position: 'absolute', right: '5px' }}>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        </>
      )}
    </Row>
  );
};
export default App;
