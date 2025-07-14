import { Trash, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { SavedSearch } from '../types';
import type { TimeFrameKey } from '../types';
import type { EditableFields } from '../types/index';
import { decodeTimeFrame } from '../utils/decodeTimeFrame';

type SavedSearchCardProps = {
  search: SavedSearch;
  onDelete: (id: string) => void;
  onEdit: (edited: SavedSearch) => void;
};

function SavedSearchCard({ search, onDelete, onEdit }: SavedSearchCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditableFields>({
    defaultValues: {
      keywords: search.keywords,
      searchRadius: search.searchRadius,
      time: search.time,
    },
  });

  const handleEditSubmit = (data: EditableFields) => {
    console.log('data', data);
    const edited: SavedSearch = {
      ...search,
      ...data,
      created_at: new Date().toISOString(),
    };

    const parsed = new URL(search.url);
    const params = parsed.searchParams;

    params.set('f_TPR', edited.time);
    params.set('distance', String(edited.searchRadius));
    params.set('keywords', edited.keywords);

    edited.url = parsed.toString();

    onEdit(edited);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <li className='bg-white rounded-xl shadow-sm px-4 py-3 text-sm text-gray-800 flex justify-between items-start'>
      {isEditing ? (
        <>
          <form
            className='space-y-3 text-sm'
            onSubmit={handleSubmit(handleEditSubmit)}
          >
            <div>
              <label
                htmlFor='keywords'
                className='block font-medium text-gray-700 mb-1'
              >
                Keywords:
              </label>
              <input
                autoFocus
                id='keywords'
                type='text'
                placeholder='e.g., Software Engineer'
                className='w-full py-1 px-3 rounded-xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-700 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400'
                {...register('keywords', {
                  required: 'Please enter a keyword.',
                  validate: (v) => v.trim() !== '',
                })}
              />
              {errors.keywords && (
                <span className='text-xs text-red-400 block mt-1'>
                  {errors.keywords.message}
                </span>
              )}
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label
                  htmlFor='searchRadius'
                  className='block font-medium text-gray-700 mb-1'
                >
                  Radius (mi):
                </label>
                <input
                  id='searchRadius'
                  type='number'
                  placeholder='25'
                  className='w-full py-1 px-3 rounded-xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-700 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400'
                  {...register('searchRadius', {
                    required: 'Search radius is required.',
                    min: { value: 1, message: 'Minimum value is 1 mile.' },
                    valueAsNumber: true,
                  })}
                />
                {errors.searchRadius && (
                  <span className='text-xs text-red-400 block mt-1'>
                    {errors.searchRadius.message}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor='time'
                  className='block font-medium text-gray-700 mb-1'
                >
                  Time Frame:
                </label>
                <select
                  id='time'
                  className='w-full py-1 px-3 rounded-xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-700 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400'
                  {...register('time')}
                >
                  <option value='r1800'>Past 30 Minutes</option>
                  <option value='r3600'>Past Hour</option>
                  <option value='r7200'>Past 2 Hours</option>
                  <option value='r86400'>Past 24 Hours</option>
                </select>
              </div>
            </div>
            <div className='flex gap-3'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='flex-1 py-1.5 text-sm rounded-xl font-semibold text-white transition 
                    bg-gradient-to-b from-violet-400 to-violet-500 
                    shadow-[4px_4px_8px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)] 
                    hover:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.4)]
                    active:shadow-inner'
              >
                Save
              </button>
              <button
                type='button'
                disabled={isSubmitting}
                onClick={handleCancel}
                className='flex-1 py-1.5 text-sm rounded-xl font-semibold text-white transition 
                    bg-gradient-to-b from-gray-300 to-gray-400 
                    shadow-[4px_4px_8px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)] 
                    hover:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.4)]
                    active:shadow-inner'
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <a href={search.url} target='_blank' rel='noopener noreferrer'>
            <p className='font-semibold text-base'>{search.keywords}</p>
            <p className='text-gray-500 mt-1'>
              {`${decodeTimeFrame(search.time as TimeFrameKey)} • within ${
                search.searchRadius
              } miles`}
            </p>
          </a>
          <button
            type='button'
            onClick={() => onDelete(search.id)}
            className='self-start p-1 hover:bg-red-50 rounded transition'
          >
            <Trash
              size={14}
              className='text-gray-400 hover:text-red-500 transition-colors duration-150'
            />
          </button>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
            }}
            className='self-start p-1 hover:bg-red-50 rounded transition'
          >
            <Pencil size={14} />
          </button>
        </>
      )}
    </li>
  );
}

export default SavedSearchCard;
