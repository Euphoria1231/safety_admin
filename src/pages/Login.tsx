import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '@/services/userService';
import type { LoginRequest } from '@/types';
import './Login.less';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 登录处理
  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await login(values);

      // 保存管理员信息和token
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.admin || response.user));

      message.success('登录成功');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 表单验证规则
  const loginRules = {
    username: [
      { required: true, message: '请输入管理员用户名' },
      { min: 3, message: '用户名至少3个字符' },
    ],
    password: [
      { required: true, message: '请输入管理员密码' },
      { min: 6, message: '密码至少6个字符' },
    ],
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      <Card className="login-card" title={null} bordered={false}>
        <div className="login-header">
          <h1 className="login-title">笔记管理系统</h1>
          <p className="login-subtitle">管理员后台登录</p>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          size="large"
        >
          <Form.Item name="username" rules={loginRules.username}>
            <Input
              prefix={<UserOutlined />}
              placeholder="管理员用户名"
            />
          </Form.Item>

          <Form.Item name="password" rules={loginRules.password}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="管理员密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-button"
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-tips">
          <p>默认管理员账号：admin</p>
          <p>默认密码：admin123456</p>
        </div>
      </Card>
    </div>
  );
};

export default Login; 