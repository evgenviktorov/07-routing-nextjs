import type { ReactNode } from 'react';
import css from './LayoutNotes.module.css';

export default function NotesFilterLayout({
  children,
  sidebar,
  modal,
}: {
  children: ReactNode; // основна зона (список нотаток)
  sidebar: ReactNode; // паралельний маршрут @sidebar
  modal: ReactNode; // паралельний маршрут @modal (інтерсепт)
}) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.notesWrapper}>{children}</section>
      {modal}
    </div>
  );
}
