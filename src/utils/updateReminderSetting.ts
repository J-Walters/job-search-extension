const updateReminderSettings = (updates: Partial<{ frequency: string; enabled: boolean }>) => {
  chrome.storage.local.get('settings', (result) => {
    const currentSettings = result.settings || {};
    const currentReminder = currentSettings.reminderSettings || {};

    chrome.storage.local.set({
      settings: {
        ...currentSettings,
        reminderSettings: {
          ...currentReminder,
          ...updates,
        },
      },
    });
  });
};
 
export { updateReminderSettings }