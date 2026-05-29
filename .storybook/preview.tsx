import type { Preview } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '@styles/global.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: { disable: true },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Foundations', ['Colors', 'Typography'], 'Components'],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        Cyberpunk: 'cyberpunk',
        Dark: 'dark',
        Light: 'light',
        Neon: 'neon',
      },
      defaultTheme: 'Cyberpunk',
      attributeName: 'data-theme',
    }),
    (Story) => (
      <div className='bg-main text-main-fg font-mono min-h-screen p-10'>
        <Story />
      </div>
    ),
  ],
};

export default preview;
