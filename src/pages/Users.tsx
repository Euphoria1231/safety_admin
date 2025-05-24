import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Row,
  Col,
  Tag,
  Avatar,
  Popconfirm,
  message,
  Modal,
  Form,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { formatDateTime } from '@/utils';
import { getUserList, deleteUser, updateUser } from '@/services/userService';
import type { User } from '@/types';
import './Users.less';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUserList({
        page: pagination.current,
        page_size: pagination.pageSize,
        keyword: searchKeyword,
      });
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, current: 1 }));
    setTimeout(fetchUsers, 0);
  };

  // 打开编辑用户模态框
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditModalVisible(true);
    form.setFieldsValue({
      username: user.username,
      email: user.email || '',
    });
  };

  // 关闭编辑模态框
  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 保存用户信息
  const handleSaveUser = async (values: { username: string; email?: string }) => {
    if (!editingUser) return;

    try {
      await updateUser(editingUser.id, values);
      message.success('用户信息更新成功');
      handleCloseEditModal();
      fetchUsers();
    } catch (error) {
      message.error('用户信息更新失败');
    }
  };

  // 删除用户
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success('删除用户成功');
      fetchUsers();
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar: string, record: User) => (
        <Avatar
          src={avatar}
          icon={<UserOutlined />}
          size={40}
        />
      ),
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
      render: (text: string) => formatDateTime(text),
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: () => <Tag color="green">正常</Tag>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">用户管理</h1>
        <p className="page-description">管理系统中的所有用户</p>
      </div>

      {/* 搜索表单 */}
      <Card className="search-form">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="搜索用户名或邮箱"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 用户表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10,
              }));
            },
          }}
        />
      </Card>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={handleCloseEditModal}
        footer={null}
        width={600}
        className="user-edit-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveUser}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, max: 30, message: '用户名长度应在2-30个字符之间' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱（可选）" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={handleCloseEditModal}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users; 