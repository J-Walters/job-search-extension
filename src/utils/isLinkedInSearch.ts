import type { SavedSearch, LinkedInSearch } from '../types';

const isLinkedInSearch = (search: SavedSearch): search is LinkedInSearch => {
  return (
    'searchRadius' in search &&
    'sortBy' in search &&
    'time' in search &&
    typeof search.searchRadius === 'number'
  );
};

export { isLinkedInSearch }