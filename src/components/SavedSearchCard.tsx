import { Trash } from 'lucide-react';

import type { SavedSearch } from '../types';
import type { TimeFrameKey } from '../types';
import { decodeTimeFrame } from '../utils/decodeTimeFrame';

type SavedSearchCardProps = {
  search: SavedSearch;
  onDelete: (id: string) => void;
};

function SavedSearchCard({ search, onDelete }: SavedSearchCardProps) {
  return (
    <li className='bg-white rounded-xl shadow-sm px-4 py-3 text-sm text-gray-800 flex justify-between items-start'>
      <a href={search.url} target='_blank' rel='noopener noreferrer'>
        <p className='font-semibold text-base'>{search.keywords}</p>
        <p className='text-gray-500 mt-1'>
          {`${decodeTimeFrame(search.time as TimeFrameKey)} • within ${
            search.searchRadius
          } miles`}
        </p>
      </a>

      <button
        type='button'
        onClick={() => onDelete(search.id)}
        className='self-start p-1 hover:bg-red-50 rounded transition'
      >
        <Trash
          size={14}
          className='text-gray-400 hover:text-red-500 transition-colors duration-150'
        />
      </button>
    </li>
  );
}

export default SavedSearchCard;
