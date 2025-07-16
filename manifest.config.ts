import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Clocked In',
  version: '1.0.0',
  action: {
    default_popup: 'index.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  permissions: ['tabs', 'storage', 'alarms'],
  host_permissions: ['<all_urls>'],
});