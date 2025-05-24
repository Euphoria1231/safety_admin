import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { formatDateTime } from '@/utils';
import { getNoteList, deleteNote } from '@/services/noteService';
import type { Note } from '@/types';
import './Notes.less';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取笔记列表
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await getNoteList({
        page: pagination.current,
        page_size: pagination.pageSize,
      });
      setNotes(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('获取笔记列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [pagination.current, pagination.pageSize]);

  // 搜索处理
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchNotes();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchKeyword('');
    setPagination(prev => ({ ...prev, current: 1 }));
    setTimeout(fetchNotes, 0);
  };

  // 查看笔记详情
  const handleViewNote = (note: Note) => {
    setViewingNote(note);
    setViewModalVisible(true);
  };

  // 关闭查看模态框
  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setViewingNote(null);
  };

  // 删除笔记
  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      message.success('删除笔记成功');
      fetchNotes();
    } catch {
      message.error('删除笔记失败');
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
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 120,
      render: (user: { id: number; username: string } | null) => user ? user.username : '-',
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => {
        if (!text) return '-';
        return text.slice(0, 100) + (text.length > 100 ? '...' : '');
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
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: unknown, record: Note) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewNote(record)}
          >
            查看
          </Button>
          <Popconfirm
            title="确定要删除这条笔记吗？"
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
    <div className="notes-page">
      <div className="page-header">
        <h1 className="page-title">笔记管理</h1>
        <p className="page-description">管理系统中的所有笔记</p>
      </div>

      {/* 搜索表单 */}
      <Card className="search-form">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="搜索标题或内容"
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

      {/* 笔记表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={notes}
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

      {/* 查看笔记模态框 */}
      <Modal
        title="查看笔记"
        open={viewModalVisible}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            关闭
          </Button>
        ]}
        width={800}
        className="note-modal"
      >
        {viewingNote && (
          <div className="note-detail">
            <div className="note-info">
              <p><strong>标题：</strong>{viewingNote.title}</p>
              <p><strong>创建时间：</strong>{formatDateTime(viewingNote.created_at)}</p>
              {viewingNote.updated_at && (
                <p><strong>更新时间：</strong>{formatDateTime(viewingNote.updated_at)}</p>
              )}
            </div>
            <div className="note-content">
              <h4>内容：</h4>
              <div className="content-text">
                {viewingNote.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Notes; 