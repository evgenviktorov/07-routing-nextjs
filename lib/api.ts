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
  tag: string;
}

export const fetchNotes = async (
  page: number,
  search?: string
): Promise<FetchNotesResponse> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.get<FetchNotesResponse>(
    'https://notehub-public.goit.study/api/notes',
    {
      params: {
        page,
        perPage: 12,
        ...(search ? { search } : {}),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createNote = async (note: CreateNoteData): Promise<Note> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.post<Note>(
    'https://notehub-public.goit.study/api/notes',
    note,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
