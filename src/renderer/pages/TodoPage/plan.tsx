import React, { useState, useEffect } from 'react';

export interface TaskDataInterface {
  task: string;
  status: string;
}

interface TaskTableDataInterface {
  name: string;
  tasks: TaskDataInterface[];
}

interface PlanDataInterface {
  userId: string;
  taskTables: TaskTableDataInterface[];
}

export function Plan() {
  var planJsonString = localStorage.getItem('myPlan');
  var planObject;
  if (planJsonString && JSON.parse(planJsonString)) {
    planObject = JSON.parse(planJsonString);
  } else {
    planObject = {
      userId: '',
      version: '0.0.1',
      taskTables: [
        {
          version: '0.0.1',
          name: 'Hello todo-gpt',
          key: '0',
          tasks: [
            { key: '0', status: ['incomplete'], task: 'add your first task' },
          ],
        },
      ],
    };
  }
  const [plan, setPlan] = useState<PlanDataInterface>(planObject);
  const [displayedTaskTableName, setDisplayedTaskTableName] =
    useState<string>('');

  // 由于拖拽api需要适用于原生set函数因此，将displayTaskTableTasks独立出来并用useEffect同步数据
  const [displayTaskTableTasks, setDisplayTaskTableTasks] = useState([]);

  useEffect(() => {
    localStorage.setItem('myPlan', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    if (displayedTaskTableName !== '') {
      setDisplayTaskTableTasks(getDisplayedTaskTable().tasks);
    } else {
      setDisplayTaskTableTasks([]);
    }
  }, [displayedTaskTableName]);

  useEffect(() => {
    if (displayedTaskTableName !== '') {
      const planTemp = { ...plan };
      const index = planTemp.taskTables.findIndex(
        (taskTable) => taskTable.name === displayedTaskTableName,
      );
      if (index !== -1) {
        if (plan.taskTables[index].tasks !== displayTaskTableTasks) {
          planTemp.taskTables[index].tasks = displayTaskTableTasks;
          setPlan(planTemp);
        } else {
        }
      } else {
        console.log(
          '未找到name为' + displayedTaskTableName + '的tasktable对象',
        );
      }
    }
  }, [displayTaskTableTasks]);

  function getTaskTableNames() {
    const planTemp = { ...plan };
    return planTemp.taskTables.map((taskTable) => {
      return taskTable.name;
    });
  }

  function selectDisplayedTaskTable(taskTableName: string) {
    const planTemp = { ...plan };

    const index = planTemp.taskTables.findIndex(
      (taskTable) => taskTable.name === taskTableName,
    );
    setDisplayedTaskTableName(taskTableName);
  }

  function getDisplayedTaskTableName() {
    return displayedTaskTableName;
  }

  function getPlan() {
    return plan;
  }

  function getDisplayedTaskTable() {
    const planTemp = { ...plan };

    const index = planTemp.taskTables.findIndex(
      (taskTable) => taskTable.name === displayedTaskTableName,
    );

    if (index !== -1) {
      return planTemp.taskTables[index];
    } else {
      console.log('未找到name为' + displayedTaskTableName + '的tasktable对象');
      return { name: '', tasks: [] };
    }
  }

  function generateUniqueKey() {
    return Math.random().toString(36).substr(2, 9);
  }

  function addTaskTable(newTaskTableName: string) {
    const updatedPlan = { ...plan };
    const isExists = updatedPlan.taskTables.some(
      (taskTable) => taskTable.name === newTaskTableName,
    );

    if (!isExists) {
      const newTaskTable = {
        version: '0.0.1',
        key: generateUniqueKey(),
        name: newTaskTableName,
        tasks: [],
      };
      updatedPlan.taskTables.push(newTaskTable);
      setPlan(updatedPlan);
    } else {
      console.log('名为' + newTaskTableName + '的tasktable已存在');
    }
  }

  function setTaskTableName(
    oldTaskTableName: string,
    newTaskTableName: string,
  ) {
    console.log('oldTaskTableName', oldTaskTableName);
    console.log('newTaskTableName', newTaskTableName);
    const updatedPlan = { ...plan };

    const index = updatedPlan.taskTables.findIndex(
      (taskTable) => taskTable.name === oldTaskTableName,
    );

    if (index !== -1) {
      const isExists = updatedPlan.taskTables.some(
        (taskTable) => taskTable.name === newTaskTableName,
      );
      if (isExists) {
        console.log('已存在name为' + newTaskTableName + '的tasktable对象');
      } else {
        updatedPlan.taskTables[index].name = newTaskTableName;
        setPlan(updatedPlan);
      }
    } else {
      console.log('未找到name为' + oldTaskTableName + '的tasktable对象');
    }
  }

  function deleteTaskTable(taskTableName: string) {
    const updatedPlan = { ...plan };
    const index = updatedPlan.taskTables.findIndex(
      (taskTable) => taskTable.name === taskTableName,
    );

    if (index !== -1) {
      updatedPlan.taskTables.splice(index, 1);
      setPlan(updatedPlan);
      setDisplayedTaskTableName('');
    } else {
      console.log('未找到name为' + taskTableName + '的tasktable对象');
    }
  }

  return {
    getPlan,
    setPlan,
    addTaskTable,
    setTaskTableName,
    deleteTaskTable,
    selectDisplayedTaskTable,
    displayTaskTableTasks,
    setDisplayTaskTableTasks,
    getDisplayedTaskTable,
    getDisplayedTaskTableName,
    getTaskTableNames,
  };
}

export interface PlanInterface {
  addTaskTable: (newTaskTableName: string) => void;
  setTaskTableName: (
    oldTaskTableName: string,
    newTaskTableName: string,
  ) => void;
  deleteTaskTable: (taskTableName: string) => void;
  selectDisplayedTaskTable: (taskTableName: string) => void;
  setDisplayTaskTableTasks: (newTasks: TaskDataInterface[]) => void;
  getDisplayedTaskTable: () => TaskTableDataInterface;
  getDisplayedTaskTableName: () => string;
  getTaskTableNames: () => string[];
}
