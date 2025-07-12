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
          className='block text-sm font-medium text-gray-600 mb-1'
        >
          Keywords:
        </label>
        <input
          className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-0'
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
          className='block text-sm font-medium text-gray-600 mb-1'
          htmlFor='searchRadius'
        >
          Search Radius (miles):
        </label>
        <input
          id='searchRadius'
          className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none'
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
          className='block text-sm font-medium text-gray-600 mb-1'
          htmlFor='time'
        >
          Filter by Time:
        </label>
        <select
          id='time'
          className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none'
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
          className='block text-sm font-medium text-gray-600 mb-1'
          htmlFor='sortBy'
        >
          Sort By:
        </label>
        <select
          id='sortBy'
          className='w-full px-4 py-2.5 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 text-gray-600 shadow-inner border border-gray-100 focus:outline-none'
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
        className='w-full py-2 rounded-2xl bg-white text-gray-600 text-sm font-medium shadow-sm border border-gray-100 hover:shadow-md active:shadow-inner transition'
      >
        {isSubmitting ? 'Searching...' : 'Go to LinkedIn'}
      </button>
    </form>
  );
}

export default LinkedInSearchForm;
