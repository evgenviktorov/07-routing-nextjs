import { createNote, type CreateNoteData } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose: () => void;
}

// тип тега з API
type Tag = CreateNoteData['tag'];
// значення форми: дозволяємо '' для плейсхолдера селекта
type FormValues = { title: string; content: string; tag: '' | Tag };

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string().max(500, 'Must be at most 500 characters'),
  tag: Yup.mixed<Tag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateNoteData) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  const initialValues: FormValues = { title: '', content: '', tag: '' };

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        const payload: CreateNoteData = {
          title: values.title,
          content: values.content,
          tag: values.tag as Tag, // після валідації Yup не буде ''
        };
        mutation.mutate(payload);
      }}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field className={css.input} name="title" id="title" type="text" />
          <ErrorMessage name="title" component="p" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            className={css.textarea}
            name="content"
            id="content"
          />
          <ErrorMessage name="content" component="p" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" className={css.select} name="tag" id="tag">
            <option value="">Select tag</option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="p" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            className={css.submitButton}
            type="submit"
            disabled={mutation.isPending}
          >
            Create
          </button>
          <button className={css.cancelButton} type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}
