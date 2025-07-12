import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import type { FormFields, SavedSearch } from './types/index';

import './App.css';

function App() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
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

  useEffect(() => {
    chrome.storage.local.get(['searches'], (result) => {
      const existingSearches = Array.isArray(result.searches)
        ? (result.searches as SavedSearch[])
        : [];
      setSearches(existingSearches);
    });
  }, []);

  // chrome.storage.local.get(['searches']);
  // chrome.storage.local.remove(['searches']);
  chrome.storage.local.get(console.log);

  const buildLinkedInSearchUrl = ({
    keywords,
    searchRadius,
    time,
    sortBy,
  }: FormFields) => {
    const base = 'https://www.linkedin.com/jobs/search/';
    const params = new URLSearchParams({
      keywords: keywords,
      distance: String(searchRadius),
      f_TPR: time,
      sortBy: sortBy,
      geoId: '90000070',
    });
    return `${base}?${params}`;
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const url = buildLinkedInSearchUrl(data);

    chrome.storage.local.get(['searches'], (result) => {
      const existingSearches = Array.isArray(result.searches)
        ? (result.searches as SavedSearch[])
        : [];

      const newSearch: SavedSearch = {
        id: nanoid(),
        ...data,
      };

      const updatedSearches = [...existingSearches, newSearch];

      chrome.storage.local.set({ searches: updatedSearches });

      setSearches(updatedSearches);

      chrome.tabs.create({ url });

      reset();
    });
  };

  return (
    <div className='max-w-lg mx-auto p-6 rounded-2xl shadow-lg bg-gray-50 shadow-violet-200/20'>
      <header className='flex flex-col'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold text-gray-700'>Clocked In</h1>
          <button
            type='button'
            className='px-3 py-1 rounded-lg bg-white text-gray-600 text-sm font-medium shadow-sm border border-gray-100'
          >
            Sign In
          </button>
        </div>
        <nav className='mt-8 flex justify-between rounded-xl bg-white px-2 py-1.5 shadow-sm border border-gray-100 text-gray-600 text-sm'>
          <button className='flex-1 px-3'>Search</button>
          <button className='flex-1 px-3'>Saved</button>
          <button className='flex-1 px-3'>Settings</button>
        </nav>
      </header>
      <main className='mt-6'>
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
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
      </main>
    </div>
  );
}

export default App;
