import { Search, Bookmark, Settings as SettingsIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

import LinkedInSearchForm from './components/LinkedInSearchForm';
import SavedSearchList from './components/SavedSearchList';
import Settings from './components/Settings';
import { useChromeStorage } from './hooks/useChromeStorage';
import type {
  SavedSearch,
  LinkedInSearch,
  LinkedInSearchFields,
  SortOption,
} from './types/index';
import { buildLinkedInSearchUrl } from './utils/index';

function App() {
  const [searches, setSearches] = useChromeStorage<SavedSearch[]>(
    'searches',
    []
  );
  const [activeTab, setActiveTab] = useState('search');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const onSubmit = (data: LinkedInSearchFields) => {
    const url = buildLinkedInSearchUrl(data);

    const newSearch: LinkedInSearch = {
      id: nanoid(),
      ...data,
      url,
      created_at: new Date().toISOString(),
    };

    const updatedSearches = [newSearch, ...searches];
    setSearches(updatedSearches);

    chrome.tabs.create({ url });
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
        <SavedSearchList
          searches={searches}
          setSearches={setSearches}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
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
      <main className='mt-4 flex-1 min-h-0'>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </main>
    </div>
  );
}

export default App;
