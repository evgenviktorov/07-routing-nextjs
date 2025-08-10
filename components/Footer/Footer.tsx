import Link from 'next/link';
import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Yevhen Tkachenko</p>
          <p>
            Contact us:
            <Link href="mailto:student@notehub.app">
              evgenviktorov88@gmail.com
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
