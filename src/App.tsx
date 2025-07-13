import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';

import LinkedInSearchForm from './components/LinkedInSearchForm';
import SavedSearchList from './components/SavedSearchList';
import type { FormFields, SavedSearch } from './types/index';

function App() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [activeTab, setActiveTab] = useState('search');

  useEffect(() => {
    chrome.storage.local.get(['searches'], (result) => {
      const existingSearches = Array.isArray(result.searches)
        ? (result.searches as SavedSearch[])
        : [];

      const sorted = [...existingSearches].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setSearches(sorted);
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
        created_at: new Date().toISOString(),
      };

      const updatedSearches = [newSearch, ...existingSearches];

      chrome.storage.local.set({ searches: updatedSearches });

      setSearches(updatedSearches);

      chrome.tabs.create({ url });
    });
  };

  const tabs = [
    {
      id: 'search',
      label: 'Search',
      content: <LinkedInSearchForm onSubmit={onSubmit} />,
    },
    {
      id: 'saved',
      label: 'Saved',
      content: (
        <SavedSearchList searches={searches} setSearches={setSearches} />
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <p>i am settings</p>,
    },
  ];

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
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-violet-100 text-violet-700 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className='mt-6'>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </main>
    </div>
  );
}

export default App;
