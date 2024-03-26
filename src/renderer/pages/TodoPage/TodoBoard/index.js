import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import { PageContext } from '../../Page';
import {
  Dropdown,
  Upload,
  Input,
  Tag,
  Popconfirm,
  Button,
  Table as AntTable,
} from 'antd';
import DraggableTodoItem, { EditableCell } from './TodoItem';
import {
  PlusOutlined,
  DownloadOutlined,
  UploadOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { DndContext } from '@dnd-kit/core';

import { UploadFilePopup } from './UploadFilePopup';

function TodoBoard({ subject, setUserSelectedLanguage }) {
  const [parentHeight, setParentHeight] = useState(0);
  const ref = useRef(null);
  const { messageApi, intl } = React.useContext(PageContext);
  const [uploadFilePopupVisible, setUploadFilePopupVisible] = useState(false);

  useEffect(() => {
    setParentHeight(ref.current.offsetHeight);
  }, []);

  const [inputValue, setInputValue] = useState('');
  function generateUniqueKey() {
    return Math.random().toString(36).substr(2, 9);
  }
  const handleDelete = (key) => {
    const newData = subject
      .getDisplayedTaskTable()
      .tasks.filter((item) => item.key !== key);
    subject.setDisplayTaskTableTasks(newData);
  };

  const handleAdd = (content) => {
    const newData = {
      key: generateUniqueKey(),
      task: content,
      status: ['incomplete'],
    };
    subject.setDisplayTaskTableTasks([
      ...subject.displayTaskTableTasks,
      newData,
    ]);
  };

  const handleToggle = (key) => {
    const prev = [...subject.displayTaskTableTasks];
    subject.setDisplayTaskTableTasks(
      prev.map((obj) => {
        if (obj.key === key) {
          if (!obj.status.includes('completed'))
            return {
              ...obj,
              status: ['completed'],
            };
          else
            return {
              ...obj,
              status: ['incomplete'],
            };
        } else {
          return obj;
        }
      }),
    );
  };

  const defaultColumns = [
    {
      key: 'sort',
    },
    {
      title: intl.formatMessage({ id: 'Task' }),
      dataIndex: 'task',
      key: 'task',
      editable: true,
    },
    {
      title: intl.formatMessage({ id: 'Status' }),
      key: 'status',
      dataIndex: 'status',
      filters: [
        {
          text: 'incomplete',
          value: 'incomplete',
        },
        {
          text: 'completed',
          value: 'completed',
        },
      ],
      filterSearch: true,
      onFilter: (value, record) => record.status.includes(value),
      render: (status) => (
        <span>
          {status.map((item) => {
            let color = 'geekblue';
            if (item === 'incomplete') {
              color = 'volcano';
            } else if (item === 'completed') {
              color = 'green';
            } else {
            }
            return (
              <Tag color={color} key={item}>
                {item.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'Action' }),
      dataIndex: '',
      key: 'x',
      render: (_, record) =>
        subject.displayTaskTableTasks.length >= 1 ? (
          <div>
            <Button onClick={() => handleToggle(record.key)}>
              {intl.formatMessage({ id: 'Toggle' })}
            </Button>
            <Popconfirm
              title={intl.formatMessage({ id: 'Sure to delete?' })}
              onConfirm={() => handleDelete(record.key)}
            >
              <Button>{intl.formatMessage({ id: 'Delete' })}</Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  let selectedTodoItemKeys = [];
  const [selectionType, setSelectionType] = useState('checkbox');

  const handleSave = (row) => {
    const newData = [...subject.displayTaskTableTasks];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    subject.setDisplayTaskTableTasks(newData);
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      subject.setDisplayTaskTableTasks((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  const components = {
    body: {
      row: DraggableTodoItem,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const TodoItemSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      selectedTodoItemKeys = selectedRowKeys;
      console.log(
        `selectedTodoItemKeys: ${selectedRowKeys}`,
        'selectedTodoItems: ',
        selectedRows,
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const items = [
    {
      key: 'en',
      label: 'en',
    },
    {
      key: 'zh',
      label: 'zh',
    },
  ];
  const handleMenuClick = (e) => {
    setUserSelectedLanguage(e.key);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      {subject.getDisplayedTaskTableName !== '' &&
      subject.displayTaskTableTasks.length > 0 ? (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            // rowKey array
            items={subject.displayTaskTableTasks.map((i) => i.key)}
            strategy={verticalListSortingStrategy}
          >
            <AntTable
              rowSelection={{
                type: selectionType,
                ...TodoItemSelection,
              }}
              columns={columns}
              dataSource={subject.displayTaskTableTasks}
              components={components}
              rowKey="key"
              pagination={false}
              scroll={{
                y: 0.8 * parentHeight,
              }}
            />
          </SortableContext>
        </DndContext>
      ) : (
        <div />
      )}
      <div
        style={{
          marginTop: 'auto',
          height: '10%',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: 'auto',
            flexDirection: 'row-reverse',
          }}
        >
          <Button
            icon={
              <DownloadOutlined
                onClick={() => {
                  const jsonDataStr = JSON.stringify(
                    subject.getPlan(),
                    null,
                    2,
                  );
                  const blob = new Blob([jsonDataStr], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(blob);

                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'plan.json';
                  a.click();

                  URL.revokeObjectURL(url);
                }}
              />
            }
          />

          <Button
            icon={<UploadOutlined />}
            onClick={() => {
              setUploadFilePopupVisible(true);
            }}
          />

          <Dropdown menu={menuProps} placement="top">
            <Button icon={<GlobalOutlined />} />
          </Dropdown>
        </div>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add task"
          onPressEnter={(e) => {
            if (
              inputValue !== '' &&
              subject.getDisplayedTaskTableName() !== ''
            ) {
              handleAdd(inputValue);
              setInputValue('');
            }
          }}
          prefix={<PlusOutlined />}
        />
      </div>
      <UploadFilePopup
        visible={uploadFilePopupVisible}
        setVisible={setUploadFilePopupVisible}
        setDataCallback={subject.setPlan}
      />
    </div>
  );
}

export default TodoBoard;
