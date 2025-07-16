const ALARM_NAME = 'reminder_alarm';

async function syncAlarm() {
  try {
    const { settings = {} } = await chrome.storage.local.get('settings');
    const reminder = settings.reminderSettings || {};

    const enabled = reminder.enabled === true;
    const freq = Number(reminder.frequency);

    await chrome.alarms.clear(ALARM_NAME);

    if (enabled && freq > 0) {
      await chrome.alarms.create(ALARM_NAME, { periodInMinutes: freq });
      console.log(`Alarm set for every ${freq} minutes`);
    } else {
      console.log(
        `Alarm cleared (enabled: ${enabled}, freq: ${reminder.frequency})`
      );
    }
  } catch (err) {
    console.error('syncAlarm error', err);
  }
}

chrome.runtime.onInstalled.addListener(syncAlarm);
chrome.runtime.onStartup.addListener(syncAlarm);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.settings) {
    syncAlarm();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: '',
      title: 'Time to check for jobs!',
      message: 'Don’t forget to run your Clocked In search.',
      silent: false,
    });
  }
});
