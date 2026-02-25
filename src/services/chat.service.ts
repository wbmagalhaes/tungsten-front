import api from './api';

export interface ChatRoom {
  id: string;
  owner_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface ListRoomsParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateRoomRequest {
  title: string;
}

export interface EditRoomRequest {
  title?: string;
}

export const listRooms = async (params?: ListRoomsParams) => {
  const res = await api.get<PaginatedResponse<ChatRoom>>('/api/chat/rooms', {
    params,
  });
  return res.data;
};

export const getRoom = async (roomId: string) => {
  const res = await api.get<ChatRoom>(`/api/chat/rooms/${roomId}`);
  return res.data;
};

export const createRoom = async (body: CreateRoomRequest) => {
  const res = await api.post<ChatRoom>('/api/chat/rooms', body);
  return res.data;
};

export const editRoom = async (roomId: string, body: EditRoomRequest) => {
  const res = await api.patch<ChatRoom>(`/api/chat/rooms/${roomId}`, body);
  return res.data;
};

export const deleteRoom = async (roomId: string) => {
  const res = await api.delete(`/api/chat/rooms/${roomId}`);
  return res.data;
};
