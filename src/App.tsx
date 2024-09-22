import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

interface Task {
  id: number;
  assignedTo: string;
  status: string;
  dueDate: string;
  priority: string;
  description: string;
  comments: string;
}

const initialTasks: Task[] = [
  { id: 1, assignedTo: 'User 1', status: 'Completed', dueDate: '2024-10-12', priority: 'Low', description: '', comments: 'This task is good' },
  { id: 2, assignedTo: 'User 2', status: 'In Progress', dueDate: '2024-09-14', priority: 'High', description: '', comments: 'This' },
  { id: 3, assignedTo: 'User 3', status: 'Not Started', dueDate: '2024-08-18', priority: 'Low', description: '', comments: 'This' },
  { id: 4, assignedTo: 'User 4', status: 'In Progress', dueDate: '2024-06-12', priority: 'Normal', description: '', comments: 'This task is good' },
];

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        ...editingTask,
        dueDate: moment(editingTask.dueDate),
      });
    } else {
      form.resetFields();
    }
  }, [editingTask, form]);

  const showModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

  const onFinish = (values: any) => {
    const newTask: Task = {
      id: editingTask ? editingTask.id : Date.now(),
      ...values,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
    };

    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? newTask : task)));
    } else {
      setTasks([...tasks, newTask]);
    }

    setIsModalVisible(false);
    setEditingTask(null);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const columns = [
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
    { title: 'Comments', dataIndex: 'comments', key: 'comments' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this task?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ margin: 0 }}>TODO LIST</h1>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            New Task
          </Button>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={tasks} rowKey="id" />

      <Modal
        title={editingTask ? 'Edit Task' : 'New Task'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="assignedTo"
            label="Assigned To"
            rules={[{ required: true, message: 'Please select the assignee' }]}
          >
            <Select placeholder="Select user">
              <Option value="User 1">User 1</Option>
              <Option value="User 2">User 2</Option>
              <Option value="User 3">User 3</Option>
              <Option value="User 4">User 4</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select the status' }]}
          >
            <Select placeholder="Select status">
              <Option value="Not Started">Not Started</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select the due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select the priority' }]}
          >
            <Select placeholder="Select priority">
              <Option value="Low">Low</Option>
              <Option value="Normal">Normal</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTask ? 'Save' : 'Create'}
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoApp;