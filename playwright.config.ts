import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export default defineConfig({
  testDir: './tests', timeout: 45000, workers: 1, reporter: 'list',
  use: { baseURL: 'http://localhost:3100', reducedMotion: 'reduce', headless: true,
    launchOptions: existsSync(chrome) ? { executablePath: chrome } : {},
    screenshot: 'only-on-failure' },
  webServer: { command: 'node node_modules/next/dist/bin/next start --port 3100', url: 'http://localhost:3100', reuseExistingServer: true, timeout: 30000 },
});
