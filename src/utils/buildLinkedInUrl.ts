import type { LinkedInSearch } from '../types';

  const buildLinkedInSearchUrl = ({
    keywords,
    searchRadius,
    time,
    sortBy,
  }: Pick<LinkedInSearch, 'keywords' | 'searchRadius' | 'time' | 'sortBy'>) => {
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

  export { buildLinkedInSearchUrl }