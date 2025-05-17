import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Function to download and convert font to base64
async function downloadFont(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:font/woff2;charset=utf-8;base64,${base64}`;
  } catch (error) {
    console.error(`Error downloading font from ${url}:`, error);
    throw error;
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gift-card-maker/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@fontsource': resolve(__dirname, 'node_modules/@fontsource')
    }
  },
  assetsInclude: ['**/*.woff2'],
});
