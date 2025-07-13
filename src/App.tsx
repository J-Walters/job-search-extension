import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';

import LinkedInSearchForm from './components/LinkedInSearchForm';
import SavedSearchList from './components/SavedSearchList';
import type { FormFields, SavedSearch } from './types/index';

import './App.css';

function App() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);

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

  const onSubmit = async (data: FormFields): Promise<void> => {
    //remove eventually
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const url = buildLinkedInSearchUrl(data);

    chrome.storage.local.get(['searches'], (result) => {
      const existingSearches = Array.isArray(result.searches)
        ? (result.searches as SavedSearch[])
        : [];

      const newSearch: SavedSearch = {
        id: nanoid(),
        ...data,
        url,
        created_at: Date.now(),
      };

      const updatedSearches = [...existingSearches, newSearch];

      chrome.storage.local.set({ searches: updatedSearches });

      setSearches(updatedSearches);

      chrome.tabs.create({ url });
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
        {/* <LinkedInSearchForm onSubmit={onSubmit} /> */}
        <SavedSearchList searches={searches} />
      </main>
    </div>
  );
}

export default App;
