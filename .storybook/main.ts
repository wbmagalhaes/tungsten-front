import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (viteConfig) => {
    const stripped = (viteConfig.plugins ?? []).flat(2).filter((plugin) => {
      const name = (plugin as { name?: string } | null)?.name ?? '';
      return (
        !name.includes('pwa') &&
        !name.includes('workbox') &&
        name !== 'build-version'
      );
    }) as PluginOption[];

    return {
      ...viteConfig,
      plugins: stripped,
    };
  },
};

export default config;
