import { useForm } from 'react-hook-form';

import type { LinkedInSearchFields } from '../types/index';

type LinkedInSearchFormProps = {
  onSubmit: (data: LinkedInSearchFields) => void;
};

function LinkedInSearchForm({ onSubmit }: LinkedInSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LinkedInSearchFields>({
    defaultValues: {
      keywords: '',
      searchRadius: 25,
      time: 'r1800',
      sortBy: 'DD',
    },
  });

  const handleLocalSubmit = (data: LinkedInSearchFields) => {
    onSubmit(data);
    reset();
  };

  return (
    <form
      className='search-container'
      onSubmit={handleSubmit(handleLocalSubmit)}
    >
      <div>
        <label htmlFor='keywords' className='search-label'>
          Keywords:
        </label>
        <input
          id='keywords'
          autoFocus
          className='search-input'
          type='text'
          placeholder='e.g., Software Engineer'
          {...register('keywords', {
            required: 'Please enter a keyword.',
            validate: (v) => v.trim() !== '',
          })}
        />
        {errors.keywords && (
          <span className='search-error'>{errors.keywords.message}</span>
        )}
      </div>
      <div>
        <label htmlFor='searchRadius' className='search-label'>
          Search Radius (miles):
        </label>
        <input
          id='searchRadius'
          className='search-input'
          type='number'
          placeholder='25'
          {...register('searchRadius', {
            required: 'Search radius is required.',
            min: { value: 1, message: 'Minimum value is 1 mile.' },
            valueAsNumber: true,
          })}
        />
        {errors.searchRadius && (
          <span className='search-error'>{errors.searchRadius.message}</span>
        )}
      </div>
      <div>
        <label htmlFor='time' className='search-label'>
          Filter by Time:
        </label>
        <select id='time' className='search-input' {...register('time')}>
          <option value='r1800'>Past 30 Minutes</option>
          <option value='r3600'>Past Hour</option>
          <option value='r7200'>Past 2 Hours</option>
          <option value='r86400'>Past 24 Hours</option>
        </select>
        <span className='search-subtext'>
          Select the time frame to filter jobs.
        </span>
      </div>
      <div>
        <label htmlFor='sortBy' className='search-label'>
          Sort By:
        </label>
        <select id='sortBy' className='search-input' {...register('sortBy')}>
          <option value='R'>Relevance</option>
          <option value='DD'>Most Recent</option>
        </select>
        <span className='search-subtext'>
          Select how you want the job listings to be sorted.
        </span>
      </div>
      <button type='submit' disabled={isSubmitting} className='search-button'>
        {isSubmitting ? 'Searching...' : 'Search on LinkedIn'}
      </button>
    </form>
  );
}

export default LinkedInSearchForm;
