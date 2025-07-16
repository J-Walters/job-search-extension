import { crx } from '@crxjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import manifest from './manifest.config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest }), tailwindcss()],
})
