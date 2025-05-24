import api from './api';
import type {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  ApiResponse,
  PaginationParams,
  PaginationResponse
} from '@/types';

// 获取笔记列表
export const getNoteList = async (params: PaginationParams & {
  keyword?: string;
  user_id?: number;
  start_date?: string;
  end_date?: string;
} = {}): Promise<PaginationResponse<Note>> => {
  const queryParams = {
    page: params.page || 1,
    per_page: params.page_size || 10,
    user_id: params.user_id
  };

  const response = await api.get<ApiResponse<{
    notes: Note[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      pages: number;
      has_prev: boolean;
      has_next: boolean;
    };
  }>>('/notes', { params: queryParams });

  const { notes, pagination } = response.data.data!;

  return {
    data: notes,
    total: pagination.total,
    page: pagination.current_page,
    page_size: pagination.per_page,
    total_pages: pagination.pages,
  };
};

// 获取笔记详情
export const getNoteDetail = async (noteId: number): Promise<Note> => {
  // 后端没有提供单独的笔记详情接口，暂时从列表中获取
  const response = await getNoteList();
  const note = response.data.find(n => n.id === noteId);
  if (!note) {
    throw new Error('笔记不存在');
  }
  return note;
};

// 创建笔记（管理员后台暂不支持）
export const createNote = async (_data: CreateNoteRequest): Promise<Note> => {
  throw new Error('管理员后台暂不支持创建笔记');
};

// 更新笔记（管理员后台暂不支持）
export const updateNote = async (_noteId: number, _data: UpdateNoteRequest): Promise<Note> => {
  throw new Error('管理员后台暂不支持编辑笔记');
};

// 删除笔记
export const deleteNote = async (noteId: number): Promise<void> => {
  await api.delete<ApiResponse>(`/notes/${noteId}`);
};

// 批量删除笔记（暂不支持）
export const batchDeleteNotes = async (_noteIds: number[]): Promise<void> => {
  throw new Error('批量删除功能暂未实现');
}; 