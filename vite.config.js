import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel(['resources/css/app.css', 'resources/js/index.jsx']),
        react({
            include: '**/*.jsx',
            fastRefresh: true, // Explicitly enable fast refresh
        }),
    ],
});
