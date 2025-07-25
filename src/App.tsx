import { Search, Bookmark, Settings as SettingsIcon } from 'lucide-react';
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

  const onSubmit = (data: LinkedInSearchFields) => {
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
      icon: <Search size={14} className='align-middle relative top-[1px]' />,
      content: <LinkedInSearchForm onSubmit={onSubmit} />,
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: <Bookmark size={14} className='align-middle relative top-[1px]' />,
      content: (
        <SavedSearchList searches={searches} setSearches={setSearches} />
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <SettingsIcon size={14} className='align-middle relative top-[1px]' />
      ),
      content: <Settings searches={searches} setSearches={setSearches} />,
    },
  ];

  return (
    <div className='header-container'>
      <header className='header'>
        <h1 className='ext-name'>Clocked In</h1>
        <span className='ext-tagline'>
          Find jobs. Stay organized. Apply faster.
        </span>
        <nav className='nav-bar'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab
                ${
                  activeTab === tab.id
                    ? 'border-[#9d86f5] text-[#9d86f5] font-semibold'
                    : 'border-transparent text-gray-500'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
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
