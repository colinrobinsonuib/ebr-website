import {defineConfig, envField} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    prefetch: true,

    vite: {
        plugins: [tailwindcss()]
    },

    env: {
        schema: {
            BUILD_TIME: envField.string({ context: "server", access: "public", default: new Date().toISOString() })
        }
    }
});