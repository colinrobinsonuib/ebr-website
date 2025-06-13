import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import rehypeImageCaption from 'rehype-image-caption';
import { remarkMarginnotesPlugin, marginnoteHandlers } from 'remark-marginnotes';
import { remarkEmbed } from './src/lib/remarkEmbed.js';

export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMarginnotesPlugin, remarkEmbed],
		rehypePlugins: [[rehypeImageCaption, { wrapImagesWithoutCaptions: false }]],
		remarkRehype: {
			handlers: marginnoteHandlers({ label: 'custom', charList: '⏴' }),
		},
	},

	prefetch: true,

	vite: {
		plugins: [tailwindcss()],
		server: {
			hmr: true /* hot reload */,
		},
	},

	env: {
		schema: {
			BUILD_TIME: envField.string({
				context: 'server',
				access: 'public',
				default: new Date().toISOString(),
			}),
			CONTENT_DIR: envField.string({
				context: 'server',
				access: 'public',
				default: './src/content',
			}),
		},
	},
});
