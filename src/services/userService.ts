import api from './api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  ApiResponse,
  PaginationParams,
  PaginationResponse
} from '@/types';

// 管理员登录
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>('/login', data);
  return response.data.data!;
};

// 管理员注册（暂时不需要，管理员账号是固定的）
export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<ApiResponse<User>>('/register', data);
  return response.data.data!;
};

// 获取当前管理员信息
export const getCurrentUser = async (): Promise<User> => {
  // 从localStorage获取用户信息，因为后端没有提供获取当前管理员信息的接口
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  throw new Error('未找到用户信息');
};

// 修改密码（暂时不支持）
export const changePassword = async (): Promise<void> => {
  throw new Error('管理员密码修改功能暂未实现');
};

// 更新用户信息（暂时不支持）
export const updateUserInfo = async (): Promise<User> => {
  throw new Error('管理员信息修改功能暂未实现');
};

// 获取用户列表
export const getUserList = async (params: PaginationParams & { keyword?: string } = {}): Promise<PaginationResponse<User>> => {
  const queryParams = {
    page: params.page || 1,
    per_page: params.page_size || 10,
    search: params.keyword || ''
  };

  const response = await api.get<ApiResponse<{
    users: User[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      pages: number;
      has_prev: boolean;
      has_next: boolean;
    };
  }>>('/users', { params: queryParams });

  const { users, pagination } = response.data.data!;

  return {
    data: users,
    total: pagination.total,
    page: pagination.current_page,
    page_size: pagination.per_page,
    total_pages: pagination.pages,
  };
};

// 获取用户详情
export const getUserDetail = async (userId: number): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>(`/users/${userId}`);
  return response.data.data!.user;
};

// 更新用户信息
export const updateUser = async (userId: number, data: { username?: string; email?: string }): Promise<User> => {
  const response = await api.put<ApiResponse<{ user: User }>>(`/users/${userId}`, data);
  return response.data.data!.user;
};

// 删除用户
export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete<ApiResponse>(`/users/${userId}`);
}; 