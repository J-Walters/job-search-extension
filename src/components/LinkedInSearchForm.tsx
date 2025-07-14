import { useForm } from 'react-hook-form';

import type { FormFields } from '../types/index';

type LinkedInSearchFormProps = {
  onSubmit: (data: FormFields) => Promise<void>;
};

function LinkedInSearchForm({ onSubmit }: LinkedInSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      keywords: '',
      searchRadius: 25,
      time: 'r1800',
      sortBy: 'DD',
    },
  });

  const handleLocalSubmit = async (data: FormFields) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form className='space-y-4' onSubmit={handleSubmit(handleLocalSubmit)}>
      <div>
        <label
          htmlFor='keywords'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Keywords:
        </label>
        <input
          autoFocus
          className='w-full px-4 py-2 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-700 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400'
          type='text'
          placeholder='e.g., Software Engineer'
          {...register('keywords', {
            required: 'Please enter a keyword.',
            validate: (v) => v.trim() !== '',
          })}
        />
        {errors.keywords && (
          <span className='text-xs text-red-400 mt-1 block'>
            {errors.keywords.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor='searchRadius'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Search Radius (miles):
        </label>
        <input
          id='searchRadius'
          className='w-full px-4 py-2 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-700 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400'
          type='number'
          placeholder='25'
          {...register('searchRadius', {
            required: 'Search radius is required.',
            min: { value: 1, message: 'Minimum value is 1 mile.' },
            valueAsNumber: true,
          })}
        />
        {errors.searchRadius && (
          <span className='text-xs text-red-400 mt-1 block'>
            {errors.searchRadius.message}
          </span>
        )}
      </div>
      <div>
        <label
          htmlFor='time'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Filter by Time:
        </label>
        <select
          id='time'
          className='w-full px-4 py-2 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-700 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400'
          {...register('time')}
        >
          <option value='r1800'>Past 30 Minutes</option>
          <option value='r3600'>Past Hour</option>
          <option value='r7200'>Past 2 Hours</option>
          <option value='r86400'>Past 24 Hours</option>
        </select>
        <span className='text-xs text-gray-400 mt-1 block'>
          Select the time frame to filter jobs.
        </span>
      </div>

      <div>
        <label
          htmlFor='sortBy'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Sort By:
        </label>
        <select
          id='sortBy'
          className='w-full px-4 py-2 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-700 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400'
          {...register('sortBy')}
        >
          <option value='R'>Relevance</option>
          <option value='DD'>Most Recent</option>
        </select>
        <span className='text-xs text-gray-400 mt-1 block'>
          Select how you want the job listings to be sorted.
        </span>
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full py-2 rounded-2xl  font-semibold text-white transition 
            bg-gradient-to-b from-violet-400 to-violet-500 
            shadow-[4px_4px_8px_rgba(0,0,0,0.08),-4px_-4px_8px_rgba(255,255,255,0.6)] 
            hover:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.4)]
            active:shadow-inner'
      >
        {isSubmitting ? 'Searching...' : 'Go to LinkedIn'}
      </button>
    </form>
  );
}

export default LinkedInSearchForm;
