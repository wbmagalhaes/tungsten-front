export const breadcrumbMap: Record<string, { label: string; parent?: string }> =
  {
    '/': { label: 'tungsten' },

    '/login': { label: 'login', parent: '/' },

    '/system-health': { label: 'system-health', parent: '/' },

    '/users': { label: 'users', parent: '/' },
    '/users/:id': { label: 'user', parent: '/users' },

    '/notes': { label: 'notes', parent: '/' },
    '/notes/:id': { label: 'note', parent: '/notes' },

    '/media': { label: 'media', parent: '/' },
    '/media/:id': { label: 'media-item', parent: '/media' },

    '/templates': { label: 'templates', parent: '/' },
    '/templates/:id': { label: 'template', parent: '/templates' },

    '/sandbox': { label: 'sandbox', parent: '/' },
    '/sandbox/:id': { label: 'run', parent: '/sandbox' },

    '/chat-bot': { label: 'chat-bot', parent: '/' },
    '/chat-bot/:id': { label: 'conversation', parent: '/chat-bot' },

    '/image-generation': { label: 'image-generation', parent: '/' },
    '/image-generation/:id': {
      label: 'generation',
      parent: '/image-generation',
    },

    '/background-jobs': { label: 'background-jobs', parent: '/' },
    '/background-jobs/:id': { label: 'job', parent: '/background-jobs' },

    '/config': { label: 'config', parent: '/' },
    '/help': { label: 'help', parent: '/' },
    '/profile': { label: 'profile', parent: '/' },
  };
