const ALARM_NAME = 'reminder_alarm';

type ReminderSettings = {
  enabled?: boolean;
  frequency?: number;
};

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    const url = new URL(details.url);
    if (
      url.hostname === 'www.linkedin.com' &&
      url.pathname.startsWith('/jobs/')
    ) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ['src/content/index.ts'],
      });
    }
  },
  { url: [{ hostEquals: 'www.linkedin.com' }] }
);

async function syncAlarm(): Promise<void> {
  try {
    const { reminderSettings = {} }: { reminderSettings?: ReminderSettings } =
      await chrome.storage.sync.get('reminderSettings');

    const enabled = reminderSettings.enabled === true;
    const freq = Number(reminderSettings.frequency);

    await chrome.alarms.clear(ALARM_NAME);

    if (!enabled || isNaN(freq) || freq <= 0) {
      console.log(
        `Alarm cleared or not set (enabled: ${enabled}, freq: ${reminderSettings.frequency})`
      );
      return;
    }

    await chrome.alarms.create(ALARM_NAME, { periodInMinutes: freq });
  } catch (err) {
    console.error('syncAlarm error:', err);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  syncAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  syncAlarm();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.reminderSettings) {
    syncAlarm();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/alarm.png'),
      title: 'Time to check for jobs!',
      message: 'Don’t forget to run your Clocked In search.',
      silent: false,
    });
  }
});
