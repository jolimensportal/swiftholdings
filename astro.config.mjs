// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  // The `site` property specifies the base URL for your site.
  // Update this to your Cloudflare Pages URL / custom domain before deploying.
  site: 'https://swiftholdings.pages.dev',
  prefetch: true,
  trailingSlash: 'never',
  experimental: {
    clientPrerender: true,
  },
  integrations: [
    react(),
    markdoc(),
    ...(process.env.SKIP_KEYSTATIC ? [] : [keystatic()]),
    svelte(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: cloudflare({
    // workerd's native binary build script was skipped in this env; use Node for build-time prerender.
    prerenderEnvironment: 'node',
    // Optimize images at build with sharp; avoid requiring a Cloudflare Images binding.
    imageService: 'compile',
    // Explicit KV binding used for Astro sessions and member records.
    sessionKVBindingName: 'SESSION',
  }),
});
