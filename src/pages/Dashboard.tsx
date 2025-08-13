import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { formatDateTime } from '@/utils';
import { getDashboardData, type DashboardData } from '@/services/dashboardService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.less';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取仪表盘数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 最近笔记表格列
  const notesColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => {
        if (!text) return '-';
        return text.slice(0, 50) + (text.length > 50 ? '...' : '');
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => text ? formatDateTime(text) : '-',
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: () => <Tag color="green">正常</Tag>,
    },
  ];

  // 最近用户表格列
  const usersColumns = [
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
      title: '注册时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text: string) => text ? formatDateTime(text) : '-',
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div>加载中...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="empty-container">
        <div>暂无数据</div>
      </div>
    );
  }

  const { statistics, recent_notes, recent_users } = dashboardData;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">管理员仪表盘</h1>
        <p className="page-description">欢迎使用Mind Guardian，这里是管理员系统概览</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="stats-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={statistics.total_users}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总笔记数"
              value={statistics.total_notes}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="脑电波用户"
              value={statistics.users_with_brainwave}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="脑电波使用率"
              value={statistics.brainwave_usage_rate}
              suffix="%"
              prefix={<PlusOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-content">
        {/* 最近笔记 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近笔记"
            extra={<a onClick={() => navigate('/notes')}>查看全部</a>}
            className="recent-notes-card"
          >
            <Table
              columns={notesColumns}
              dataSource={recent_notes}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 最近用户 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近用户"
            extra={<a onClick={() => navigate('/users')}>查看全部</a>}
            className="recent-users-card"
          >
            <Table
              columns={usersColumns}
              dataSource={recent_users}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Row gutter={[16, 16]} className="quick-actions">
        <Col span={24}>
          <Card title="快速操作" className="quick-actions-card">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card
                  hoverable
                  className="action-card"
                  onClick={() => navigate('/users')}
                >
                  <div className="action-icon">
                    <UserOutlined />
                  </div>
                  <div className="action-title">用户管理</div>
                  <div className="action-desc">管理系统用户</div>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card
                  hoverable
                  className="action-card"
                  onClick={() => navigate('/notes')}
                >
                  <div className="action-icon">
                    <FileTextOutlined />
                  </div>
                  <div className="action-title">笔记管理</div>
                  <div className="action-desc">查看所有笔记</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 