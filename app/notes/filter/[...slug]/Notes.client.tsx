'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';

import { fetchNotes, type FetchNotesResponse } from '@/lib/api';
import type { Note } from '@/types/note';
import css from './Notes.client.module.css';

interface Props {
  tag: string; // 'All' | 'Todo' | ...
  initialData?: FetchNotesResponse;
}

export default function NotesClient({ tag, initialData }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tag]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, debouncedSearch, tag),
    initialData,
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const pageCount = data?.totalPages ?? 0;

  const handlePageChange = (p: number) => setPage(p);

  return (
    <main>
      <div className={css.container}>
        <div className={css.toolbar}>
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note
          </button>

          {pageCount > 1 && (
            <Pagination
              totalPages={pageCount}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}

          <SearchBox value={search} onChange={setSearch} />
        </div>

        <NoteList
          notes={notes as Note[]}
          isLoading={isLoading}
          isError={isError}
        />

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    </main>
  );
}
