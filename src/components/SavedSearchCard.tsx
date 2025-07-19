import { Trash, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { SavedSearch, LinkedInSearch, EditFields } from '../types';
import {
  decodeTimeFrame,
  decodeSortBy,
  getBaseDomain,
  isLinkedInSearch,
} from '../utils';

type SavedSearchCardProps = {
  search: SavedSearch;
  onDelete: (id: string) => void;
  onEdit: (edited: SavedSearch) => void;
};

function SavedSearchCard({ search, onDelete, onEdit }: SavedSearchCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const isLinkedIn = isLinkedInSearch(search);
  const domain = getBaseDomain(search.url);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFields>({
    defaultValues: isLinkedIn
      ? {
          keywords: search.keywords,
          searchRadius: (search as LinkedInSearch).searchRadius,
          time: (search as LinkedInSearch).time,
        }
      : {
          keywords: search.keywords,
        },
  });

  const handleEditSubmit = (data: EditFields) => {
    let edited: SavedSearch = {
      ...search,
      ...data,
      created_at: new Date().toISOString(),
    };

    if (isLinkedInSearch(edited)) {
      const parsed = new URL(search.url);
      const params = parsed.searchParams;
      params.set('f_TPR', edited.time);
      params.set('distance', String(edited.searchRadius));
      params.set('keywords', edited.keywords);
      edited = {
        ...edited,
        url: parsed.toString(),
      };
    }

    onEdit(edited);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <li className='card'>
      {isEditing ? (
        <form
          className='w-full space-y-2 text-sm'
          onSubmit={handleSubmit(handleEditSubmit)}
        >
          <div>
            <label htmlFor='keywords' className='sr-only'>
              Keywords:
            </label>
            <input
              autoFocus
              id='keywords'
              type='text'
              placeholder='e.g., Software Engineer'
              className='edit-input w-full '
              {...register('keywords', {
                required: 'Please enter a keyword.',
                validate: (v) => v.trim() !== '',
              })}
            />
            {errors.keywords && (
              <span className='edit-error'>{errors.keywords.message}</span>
            )}
          </div>
          {isLinkedIn && (
            <div className='grid grid-cols-[auto_1fr] gap-7 items-end'>
              <div>
                <label htmlFor='searchRadius' className='sr-only'>
                  Radius (miles):
                </label>
                <input
                  id='searchRadius'
                  type='number'
                  placeholder='25'
                  className='edit-input w-[96px]'
                  {...register('searchRadius', {
                    required: 'Search radius is required.',
                    min: { value: 1, message: 'Minimum value is 1 mile.' },
                    valueAsNumber: true,
                  })}
                />
                {errors.searchRadius && (
                  <span className='edit-error'>
                    {errors.searchRadius.message}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor='time' className='sr-only'>
                  Time Frame:
                </label>
                <select id='time' className='edit-input' {...register('time')}>
                  <option value='r1800'>Past 30 Minutes</option>
                  <option value='r3600'>Past Hour</option>
                  <option value='r7200'>Past 2 Hours</option>
                  <option value='r86400'>Past 24 Hours</option>
                </select>
              </div>
            </div>
          )}
          <div className='edit-button-container'>
            <button
              type='button'
              onClick={handleCancel}
              className='edit-cancel-button'
            >
              Cancel
            </button>
            <button type='submit' className='edit-save-button'>
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <a
            href={search.url}
            target='_blank'
            rel='noopener noreferrer'
            className='card-content'
          >
            <p className='card-title'>{search.keywords}</p>
            {isLinkedIn && (
              <>
                <p className='card-meta'>
                  {`${decodeTimeFrame(search.time)} • within ${
                    search.searchRadius
                  } miles`}
                </p>
                <span className='edit-save-button'>
                  {decodeSortBy(search.sortBy)}
                </span>
              </>
            )}
            {domain && <span className='edit-save-button ml-2'>{domain}</span>}
          </a>
          <button
            type='button'
            onClick={() => onDelete(search.id)}
            className='card-action card-action-delete'
          >
            <Trash size={12} className='icon-delete' />
          </button>
          <button
            type='button'
            onClick={() => setIsEditing(!isEditing)}
            className='card-action card-action-edit'
          >
            <Pencil size={12} className='icon-edit' />
          </button>
        </>
      )}
    </li>
  );
}

export default SavedSearchCard;
