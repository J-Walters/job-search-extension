import type { SavedSearch } from '../types';
import type { TimeFrameKey } from '../types';
import { decodeTimeFrame } from '../utils/decodeTimeFrame';
import SavedSearchCard from './SavedSearchCard';

type SavedSearchListProps = {
  searches: SavedSearch[];
};

function SavedSearchList({ searches }: SavedSearchListProps) {
  return (
    <>
      {searches.length > 0 ? (
        <>
          <ul className='space-y-4'>
            {searches.map((search) => (
              <SavedSearchCard search={search} />
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
