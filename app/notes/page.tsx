import { fetchNotes } from '@/lib/api';
import type { FetchNotesResponse } from '@/lib/api';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  const page = 1;
  const search = '';

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes(page, search),
  });

  const initialData = queryClient.getQueryData<FetchNotesResponse>([
    'notes',
    page,
    search,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialData={initialData} />
    </HydrationBoundary>
  );
}
