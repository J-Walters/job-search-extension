import { PlusCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type {
  SavedSearch,
  ManualSearch,
  SortOption,
  FormInputs,
} from '../types';
import SavedSearchCard from './SavedSearchCard';
import SortDropdown from './SortDropdown';

const sortFunctions = {
  newest: (a: SavedSearch, b: SavedSearch) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  oldest: (a: SavedSearch, b: SavedSearch) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  az: (a: SavedSearch, b: SavedSearch) => a.keywords.localeCompare(b.keywords),
  za: (a: SavedSearch, b: SavedSearch) => b.keywords.localeCompare(a.keywords),
};

type SavedSearchListProps = {
  searches: SavedSearch[];
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
};

function SavedSearchList({
  searches,
  setSearches,
  sortOption,
  setSortOption,
}: SavedSearchListProps) {
  const [addNew, setAddNew] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  };

  const handleEdit = (edited: SavedSearch) => {
    const updated = searches
      .map((search) => (search.id === edited.id ? edited : search))
      .sort(sortFunctions[sortOption]);
    setSearches(updated);
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
    const newSearch: ManualSearch = {
      id: nanoid(),
      ...data,
      created_at: new Date().toISOString(),
    };

    const updated = [newSearch, ...searches];
    setSearches(updated);
    setAddNew(false);
    reset();
  };

  const filtered = searches
    .filter((search) =>
      search.keywords.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(sortFunctions[sortOption]);

  return (
    <>
      {addNew ? (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3 mb-4'>
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
            <p className='text-xs text-red-400'>Keywords cannot be empty.</p>
          )}

          <div className='relative'>
            <input
              id='url'
              type='url'
              placeholder='https://example.com'
              className='search-input pr-20'
              {...register('url', {
                required: 'Please enter a valid URL',
                validate: (v) => v.trim() !== '',
              })}
            />
            <button
              type='button'
              onClick={handleCopyLink}
              className='absolute top-1/2 right-2 -translate-y-1/2 text-xs text-violet-600 hover:underline'
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
          <div className='flex justify-end gap-2'>
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
          </div>
        </form>
      ) : (
        <div className='flex items-center gap-2 mb-3'>
          <div className='flex items-center border border-gray-300 bg-white rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-[#9d86f5] w-full max-w-[175px]'>
            <input
              type='search'
              placeholder='Search saved titles...'
              className='flex-1 text-xs placeholder:text-gray-400 focus:outline-none'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <SortDropdown sortOption={sortOption} onChange={setSortOption} />
          <button
            type='button'
            title='Add New Search'
            onClick={() => setAddNew(true)}
            className='h-9 w-9 flex items-center justify-center text-[#9d86f5] border border-gray-300 bg-white rounded-xl hover:ring-1 hover:ring-[#9d86f5] transition'
          >
            <PlusCircle size={16} />
          </button>
        </div>
      )}
      {filtered.length > 0 ? (
        <div className='max-h-[400px] overflow-y-auto pr-1 hidden-scrollbar'>
          <ul className='space-y-4'>
            {filtered.map((search) => (
              <SavedSearchCard
                key={search.id}
                search={search}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className='text-sm text-center text-gray-400 italic mt-4'>
          {searches.length > 0
            ? 'No searches found!'
            : 'No saved searches. But hey, clean slate!'}
        </p>
      )}
    </>
  );
}

export default SavedSearchList;
