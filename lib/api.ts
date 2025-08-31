// lib/api.ts
import type { Note } from '@/types/note';
import axios from 'axios';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: Note['tag']; // використовуємо той самий union, що і в Note
}

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const client = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}` },
});

// Явний тип параметрів запиту (без any)
type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
};

// page — 1-based; search — рядок; tag — якщо 'All', НЕ передаємо
export const fetchNotes = async (
  page: number,
  search = '',
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: FetchNotesParams = { page, perPage: 12 };

  if (search) params.search = search;
  if (tag && tag !== 'All') params.tag = tag;

  const { data } = await client.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await client.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (payload: CreateNoteData): Promise<Note> => {
  const { data } = await client.post<Note>('/notes', payload);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await client.delete<Note>(`/notes/${id}`);
  return data;
};
