import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
export default defineConfig({site: process.env.SITE_URL || 'https://3sgroup.3sgroup-bemom.workers.dev', integrations:[mdx(),sitemap()]});
