import type { FetchNotesResponse } from '@/lib/api';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] || 'All';

  const initialData: FetchNotesResponse | undefined = undefined;

  return <NotesClient tag={tag} initialData={initialData} />;
}
