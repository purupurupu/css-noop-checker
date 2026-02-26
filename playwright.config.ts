import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
