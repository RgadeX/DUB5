// Game Registry - Single source of truth for all portal items
export const registry = [
  // Games (only implemented games)
  {
    id: 'snake',
    title: 'Snake',
    description: 'Klassiek slangen-spel, vlotte besturing.',
    category: 'games',
    icon: 'snake',
    tags: ['arcade', 'keyboard'],
    minPlayers: 1,
    isNew: true
  },
  // Tools (placeholder for future implementation)
  {
    id: 'calculator',
    title: 'Rekenmachine',
    description: 'Eenvoudige rekenmachine (binnenkort beschikbaar).',
    category: 'tools',
    icon: 'calculator',
    tags: ['utility'],
    minPlayers: 1
  },
  {
    id: 'color-picker',
    title: 'Kleurenkiezer',
    description: 'Kies en converteer kleurcodes (binnenkort beschikbaar).',
    category: 'tools',
    icon: 'palette',
    tags: ['utility'],
    minPlayers: 1
  },
  {
    id: 'qr-generator',
    title: 'QR Generator',
    description: 'Maak direct een QR-code van tekst (binnenkort beschikbaar).',
    category: 'tools',
    icon: 'qr',
    tags: ['utility'],
    minPlayers: 1
  },
  // Study (placeholder for future implementation)
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Snel overhoren met kaartjes (binnenkort beschikbaar).',
    category: 'study',
    icon: 'flashcard',
    tags: ['study'],
    minPlayers: 1
  },
  {
    id: 'quiz',
    title: 'Oefentoetsen',
    description: 'Test je kennis met oefenvragen (binnenkort beschikbaar).',
    category: 'study',
    icon: 'quiz',
    tags: ['study'],
    minPlayers: 1
  },
  // Guides (placeholder for future implementation)
  {
    id: 'install-guide',
    title: 'Installatie Gids',
    description: 'Hoe installeer je DUB5 (binnenkort beschikbaar).',
    category: 'guides',
    icon: 'guide',
    tags: ['guide'],
    minPlayers: 1
  },
  {
    id: 'faq',
    title: 'Veelgestelde Vragen',
    description: 'Antwoorden op de meestgestelde vragen (binnenkort beschikbaar).',
    category: 'guides',
    icon: 'help',
    tags: ['guide'],
    minPlayers: 1
  }
];

// Helper to get items by category
export function getByCategory(category) {
  return registry.filter(item => item.category === category);
}

// Helper to get item by ID
export function getById(id) {
  return registry.find(item => item.id === id);
}

// Helper to get all categories
export function getCategories() {
  return [...new Set(registry.map(item => item.category))];
}
