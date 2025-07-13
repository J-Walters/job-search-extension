import type { SavedSearch } from '../types';
import type { TimeFrameKey } from '../types';
import { decodeTimeFrame } from '../utils/decodeTimeFrame';

type SavedSearchCardProps = {
  search: SavedSearch;
};

function SavedSearchCard({ search }: SavedSearchCardProps) {
  return (
    <li
      key={search.id}
      className='bg-white rounded-xl shadow-sm px-4 py-3 text-sm text-gray-800 flex justify-between items-start'
    >
      <a href={search.url} target='_blank' rel='noopener noreferrer'>
        <p className='font-semibold text-base'>{search.keywords}</p>
        <p className='text-gray-500 mt-1'>
          {`${decodeTimeFrame(search.time as TimeFrameKey)} • within ${
            search.searchRadius
          } miles`}
        </p>
      </a>
    </li>
  );
}

export default SavedSearchCard;
