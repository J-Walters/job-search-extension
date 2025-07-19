import type { TimeFrameKey, SortByKey } from '../types';

const map: Record<TimeFrameKey, string> = {
  r1800: 'Past 30 minutes',
  r3600: 'Past hour',
  r7200: 'Past 2 hours',
  r86400: 'Past 24 hours',
};

const decodeTimeFrame = (value: TimeFrameKey): string => {
  return map[value];
};

const recencyMap: Record<SortByKey, string> = {
  DD: 'Most Recent',
  R: 'Most Relevant'
}

const decodeSortBy = (value: SortByKey):string => {
  return recencyMap[value];
}

export {decodeSortBy, decodeTimeFrame}