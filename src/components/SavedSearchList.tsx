import { PlusCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { SavedSearch, ManualSearch } from '../types';
import SavedSearchCard from './SavedSearchCard';

type SavedSearchListProps = {
  searches: SavedSearch[];
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
};

type FormInputs = Omit<ManualSearch, 'id'>;

function SavedSearchList({ searches, setSearches }: SavedSearchListProps) {
  const [addNew, setAddNew] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>();

  const handleDelete = (id: string) => {
    const updatedSearches = searches.filter((search) => search.id !== id);
    setSearches(updatedSearches);
    chrome.storage.local.set({ searches: updatedSearches });
  };

  const handleEdit = (edited: SavedSearch) => {
    const updatedSearches = searches
      .map((s) => (s.id === edited.id ? edited : s))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    setSearches(updatedSearches);
    chrome.storage.local.set({ searches: updatedSearches });
  };

  const handleCopyLink = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    setValue('url', tab.url ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = (data: FormInputs) => {
    chrome.storage.local.get(['searches'], (result) => {
      const existingSearches = Array.isArray(result.searches)
        ? (result.searches as SavedSearch[])
        : [];

      const newSearch: ManualSearch = {
        id: nanoid(),
        ...data,
        created_at: new Date().toISOString(),
      };

      const updatedSearches = [newSearch, ...existingSearches];

      chrome.storage.local.set({ searches: updatedSearches });

      setSearches(updatedSearches);
    });

    setAddNew(false);
    reset();
  };

  return (
    <>
      {addNew ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='keywords' className='sr-only'>
            Keywords:
          </label>
          <input
            autoFocus
            id='keywords'
            type='text'
            placeholder='e.g. Software Engineer - Builtin'
            className='search-input'
            {...register('keywords', {
              required: 'Please add a title.',
              validate: (v) => v.trim() !== '',
            })}
          />
          {errors.keywords && (
            <p className='text-xs text-red-400 mt-1'>
              Keywords cannot be empty.
            </p>
          )}
          <div>
            <label htmlFor='url' className='sr-only'>
              URL
            </label>
            <input
              id='url'
              type='url'
              placeholder='https://example.com'
              className='search-input'
              {...register('url', {
                required: 'Please enter a valid URL',
                validate: (v) => v.trim() !== '',
              })}
            />
            {errors.url && (
              <p className='text-xs text-red-400 mt-1'>
                Please enter a valid URL.
              </p>
            )}
            <button
              id='copy-button'
              type='button'
              onClick={handleCopyLink}
              className='edit-save-button'
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
          <button
            type='button'
            onClick={() => {
              setAddNew(false);
              reset();
            }}
            className='edit-cancel-button'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='edit-save-button'
            disabled={isSubmitting}
          >
            Save
          </button>
        </form>
      ) : (
        <div className='flex justify-center mb-3'>
          <button
            type='button'
            onClick={() => setAddNew(true)}
            className='add-new-btn'
          >
            <PlusCircle size={14} className='inline-block' />
            Add New Search
          </button>
        </div>
      )}
      {searches.length > 0 ? (
        <>
          {/* <div className='relative'> */}
          <div className='max-h-[400px] overflow-y-auto pr-1'>
            <ul className='space-y-4'>
              {searches.map((search) => (
                <SavedSearchCard
                  key={search.id}
                  search={search}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </ul>
          </div>

          {/* Gradient overlay */}
          {/* <div className='pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent' />
          </div> */}
        </>
      ) : (
        <p className='text-sm text-gray-500'>No saved searches</p>
      )}
    </>
  );
}

export default SavedSearchList;
