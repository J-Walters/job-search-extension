const removeJobs = () => {
  chrome.storage.local.get(['companyTags'], (result) => {
    const blockedCompanies = result.companyTags ? result.companyTags : [];
    const blockedCompanyNames = blockedCompanies
      .map(tag => tag.company?.trim().toLowerCase())
      .filter(Boolean);
    console.log('Blocked companies:', blockedCompanyNames);

    const cards = document.querySelectorAll('li[data-occludable-job-id]');
    console.log('Number of job cards found:', cards.length);

    cards.forEach((card, i) => {
      const companySpan = card.querySelector('div.artdeco-entity-lockup__subtitle span');
      const companyName = companySpan?.textContent?.trim().toLowerCase();
      console.log(`#${i}: Company name found:`, companyName);

      if (companyName && blockedCompanyNames.includes(companyName)) {
        console.log(`Removing card #${i} for company:`, companyName);
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
    console.log('Job results list not found, retrying in 500ms...');
    setTimeout(observeJobs, 500); // Try again in half a second
    return;
  }
  console.log('Observing job results list for changes.');
  const observer = new MutationObserver(() => {
    console.log('Mutation observed: job list changed, removing blocked jobs.');
    removeJobs();
  });
  observer.observe(list, { childList: true, subtree: true });
  removeJobs();
};

console.log('LinkedIn filter extension script running!');
observeJobs();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.companyTags) {
    console.log('Detected changes to companyTags. Re-running removeJobs.');
    removeJobs();
  }
});
