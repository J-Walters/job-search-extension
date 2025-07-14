import type { SavedSearch } from '../types';
import SavedSearchCard from './SavedSearchCard';

type SavedSearchListProps = {
  searches: SavedSearch[];
  setSearches: React.Dispatch<React.SetStateAction<SavedSearch[]>>;
};

function SavedSearchList({ searches, setSearches }: SavedSearchListProps) {
  const handleDelete = (id: string) => {
    const updatedSearches = searches.filter((search) => search.id !== id);
    setSearches(updatedSearches);
    chrome.storage.local.set({ searches: updatedSearches });
  };

  return (
    <>
      {searches.length > 0 ? (
        <>
          {/* <button
            type='button'
            className='w-full mb-4 py-2 rounded-2xl bg-white text-gray-600 text-sm font-medium shadow-sm border border-gray-100 hover:shadow-md active:shadow-inner transition'
          >
            Add New Search
          </button> */}
          <ul className='space-y-4'>
            {searches.map((search) => (
              <SavedSearchCard
                key={search.id}
                search={search}
                onDelete={handleDelete}
              />
            ))}
          </ul>
          {/* <button
            type='button'
            className='w-full mt-4 py-2 rounded-2xl bg-white text-gray-600 text-sm font-medium shadow-sm border border-gray-100 hover:shadow-md active:shadow-inner transition'
          >
            Add New Search
          </button> */}
        </>
      ) : (
        <p className='text-sm text-gray-500'>No saved searches</p>
      )}
    </>
  );
}

export default SavedSearchList;
