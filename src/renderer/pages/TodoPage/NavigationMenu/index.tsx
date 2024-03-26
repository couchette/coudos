import React, { useEffect, useState } from 'react';
import { Menu, Button, Row, Col, Dropdown } from 'antd';
import { PageContext } from '../../Page';
import NavMenuItem from './NavMenuItem';
import { PlusCircleFilled, CommentOutlined } from '@ant-design/icons';
import { CreateTaskTablePopup } from './Popup';
import { PlanInterface } from '../plan';

export const NavigationMenu: React.FC<{
  user: any;
  subject: PlanInterface;
}> = ({ user, subject }) => {
  const [createTaskTablePopupVisible, setCreateTaskTablePopupVisible] =
    useState(false);
  const { messageApi, intl } = React.useContext(PageContext);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
        minWidth: '150px',
      }}
    >
      <Menu
        onClick={(e) => {
          subject.selectDisplayedTaskTable(e.key);
        }}
        selectedKeys={[subject.getDisplayedTaskTable().name]}
        style={{
          borderRadius: '5px',
          overflow: 'auto',
          flex: 1,
        }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <Menu.SubMenu
          key={'sub1'}
          title={intl.formatMessage({ id: 'plan' })}
          icon={<CommentOutlined />}
        >
          <Menu.ItemGroup
            key={'g1'}
            title={intl.formatMessage({ id: 'recently' })}
          >
            {subject.getTaskTableNames().map((name) => (
              <Menu.Item key={name}>
                <NavMenuItem
                  title={name}
                  setTitle={(option) => {
                    if (option !== null) {
                      subject.setTaskTableName(name, option);
                      subject.selectDisplayedTaskTable(option);
                    } else {
                      subject.deleteTaskTable(name);
                      subject.selectDisplayedTaskTable('');
                    }
                  }}
                />
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        </Menu.SubMenu>
      </Menu>
      <Button
        onClick={() => {
          setCreateTaskTablePopupVisible(true);
        }}
      >
        <Row align={'middle'} justify={'center'}>
          <Col className="gutter-row" span={24}>
            <div>
              <PlusCircleFilled />
            </div>
          </Col>
        </Row>
      </Button>

      <CreateTaskTablePopup
        visible={createTaskTablePopupVisible}
        setVisible={setCreateTaskTablePopupVisible}
        createTaskTableCallback={(newTaskTableName) => {
          subject.addTaskTable(newTaskTableName);
          subject.selectDisplayedTaskTable(newTaskTableName);
        }}
      />
    </div>
  );
};
