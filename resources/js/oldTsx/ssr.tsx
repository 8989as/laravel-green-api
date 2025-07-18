import './i18n';
import { createInertiaApp } from '@inertiajs/inertia-react';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export default function render(page: any) {
    return createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: async (name) => {
            const pages = import.meta.glob('./pages/**/*.tsx');
            const page = pages[`./pages/${name}.tsx`];
            return page ? ((await page()) as any).default : null;
        },
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    });
}
