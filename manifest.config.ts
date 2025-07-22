import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Clocked In',
  version: '1.0.0',
  action: {
    default_popup: 'index.html',
  },
  icons: {
    16: 'icons/alarm.png',
    48: 'icons/alarm.png',
    128: 'icons/alarm.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [{
    js: ['src/content/index.ts'],
    matches: ['https://www.linkedin.com/jobs/*']
  }],
  permissions: ['tabs', 'storage', 'alarms', 'notifications'],
  host_permissions: ['<all_urls>'],
});