import type { FetchNotesResponse } from '@/lib/api';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  const page = 1;
  const search = '';

  let initialData: FetchNotesResponse;

  try {
    const res = await fetchNotes(page, search);
    initialData = {
      notes: res.notes ?? [],
      totalPages: res.totalPages ?? 0,
      page: res.page ?? page,
      perPage: res.perPage ?? 0,
    };
  } catch {
    initialData = { notes: [], totalPages: 0, page, perPage: 0 };
  }

  return <NotesClient initialData={initialData} />;
}
