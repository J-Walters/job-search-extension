import type { TimeFrameKey } from '../types';

const map: Record<TimeFrameKey, string> = {
  r1800: 'Past 30 minutes',
  r3600: 'Past hour',
  r7200: 'Past 2 hours',
  r86400: 'Past 24 hours',
};

export const decodeTimeFrame = (value: TimeFrameKey): string => {
  return map[value];
};

const recencyMap: Record<'DD' | 'R', string> = {
  DD: 'Most Recent',
  R: 'Most Relevant'
}

export const decodeSortBy = (value: 'DD' | 'R'):string => {
  return recencyMap[value];
}