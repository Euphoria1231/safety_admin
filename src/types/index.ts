// 用户相关接口
export interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email?: string;
}

export interface LoginResponse {
  admin?: {
    username: string;
    role: string;
    login_time: string;
  };
  user?: User;
  token: string;
}

// 笔记相关接口
export interface Note {
  id: number;
  title: string;
  content: string;
  user_id: number;
  user?: {
    id: number;
    username: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

// API响应接口
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 分页接口
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// 表格列配置
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  render?: (text: any, record: any) => React.ReactNode;
}

// 搜索参数
export interface SearchParams {
  keyword?: string;
  start_date?: string;
  end_date?: string;
} 