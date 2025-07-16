const ALARM_NAME = 'reminder_alarm';

type ReminderSettings = {
  enabled?: boolean;
  frequency?: string | number;
};

type LocalSettings = {
  reminderSettings?: ReminderSettings;
};

async function syncAlarm(): Promise<void> {
  try {
    const { settings = {} }: { settings?: LocalSettings } =
      await chrome.storage.local.get('settings');

    const reminder = settings?.reminderSettings ?? {};
    const enabled = reminder.enabled === true;
    const freq = Number(reminder.frequency);

    await chrome.alarms.clear(ALARM_NAME);

    if (!enabled || isNaN(freq) || freq <= 0) {
      console.log(
        `Alarm cleared or not set (enabled: ${enabled}, freq: ${reminder.frequency})`
      );
      return;
    }

    await chrome.alarms.create(ALARM_NAME, { periodInMinutes: freq });
    console.log(`Alarm set for every ${freq} minutes`);
  } catch (err) {
    console.error('syncAlarm error:', err);
  }
}


chrome.runtime.onInstalled.addListener(() => {
  console.log('Installed — syncing alarm');
  syncAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Startup — syncing alarm');
  syncAlarm();
});


chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    console.log('Settings changed — syncing alarm');
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
