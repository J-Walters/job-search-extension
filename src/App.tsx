import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';

import LinkedInSearchForm from './components/LinkedInSearchForm';
import SavedSearchList from './components/SavedSearchList';
import Settings from './components/Settings';
import type {
  SavedSearch,
  LinkedInSearch,
  LinkedInSearchFields,
} from './types/index';
import { buildLinkedInSearchUrl } from './utils/index';

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

  const onSubmit = async (data: LinkedInSearchFields): Promise<void> => {
    //remove eventually
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const url = buildLinkedInSearchUrl(data);

    chrome.storage.local.get(['searches'], (result) => {
      const existingSearches = Array.isArray(result.searches)
        ? (result.searches as SavedSearch[])
        : [];

      const newSearch: LinkedInSearch = {
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
      content: <Settings searches={searches} setSearches={setSearches} />,
    },
  ];

  return (
    <div className='max-h-[640px] w-full flex flex-col mx-auto p-4 rounded-2xl bg-gray-50 shadow-[0_0_20px_rgba(139,92,246,0.5)]'>
      <header className='flex flex-col'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Clocked In</h1>
          {/* <button
            type='button'
            className='px-3 py-1 rounded-lg bg-white text-gray-600 text-sm font-medium shadow-sm border border-gray-100'
          >
            Sign In
          </button> */}
        </div>
        <nav className='mt-6 flex justify-between rounded-xl bg-white px-2 py-1.5 shadow-sm border border-gray-100 text-gray-600 text-sm'>
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
