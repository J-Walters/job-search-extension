import type { Tags } from '../types/index'

const removeJobs = () => {
  chrome.storage.sync.get(['companyTags'], (result) => {
    const blockedCompanies = result.companyTags ? result.companyTags : [];
    const blockedCompanyNames = blockedCompanies
      .map((tag: Tags) => tag.company?.trim().toLowerCase())
      .filter(Boolean);

    const cards = document.querySelectorAll('li[data-occludable-job-id]');

    cards.forEach((card) => {
      const companySpan = card.querySelector('div.artdeco-entity-lockup__subtitle span');
      const companyName = companySpan?.textContent?.trim().toLowerCase();

      if (companyName && blockedCompanyNames.includes(companyName)) {

        card.remove();
      }
    });
  });
};

const observeJobs = () => {
  const list = document.querySelector('ul[data-test-reusables-search-result-list]') ||
               document.querySelector('ul.jobs-search__results-list') ||
               document.querySelector('ul.jobs-search-results__list') ||
               document.querySelector('ul.scaffold-layout__list-container') ||
               document.querySelector('ul')
  if (!list) {
    setTimeout(observeJobs, 500);
    return;
  }
  console.log('Observing job results list for changes.');
  const observer = new MutationObserver(() => {
    removeJobs();
  });
  observer.observe(list, { childList: true, subtree: true });
  removeJobs();
};

observeJobs();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.companyTags) {
    removeJobs();
  }
});
