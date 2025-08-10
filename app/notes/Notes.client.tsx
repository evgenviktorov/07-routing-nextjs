'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';

import { fetchNotes } from '@/lib/api';
import type { Note } from '@/types/note';
import type { FetchNotesResponse } from '@/lib/api';
import css from './Notes.client.module.css';

interface NotesClientProps {
  initialData: FetchNotesResponse;
}

export default function NotesClient({ initialData }: NotesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    initialData: page === 1 && debouncedSearch === '' ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: 0,
  });

  const notes = data?.notes ?? [];
  const pageCount = data?.totalPages ?? 0;

  const handlePageChange = (arg: number | { selected: number }) => {
    const nextPage = typeof arg === 'number' ? arg : (arg?.selected ?? 0) + 1;
    setPage(nextPage);
  };

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note
        </button>

        {pageCount > 1 && (
          <Pagination
            totalPages={pageCount}
            onPageChange={handlePageChange}
            currentPage={page}
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
  );
}
