import { Category } from '@prisma/client';

export const categories: Category[] = [
  {
    id: 'category-1',
    name: 'Défis en famille',
    description:
      'Des défis à réaliser en famille, pour partager des moments conviviaux et amusants ensemble.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'category-2',
    name: 'Défis en solo',
    description:
      'Des défis à relever seul, pour tester ses compétences et sa créativité de manière individuelle.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'category-3',
    name: 'Défis entre amis',
    description:
      'Des défis à faire entre amis, pour créer des souvenirs mémorables et se challenger ensemble.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'category-4',
    name: 'Défis sportifs',
    description:
      'Des défis physiques à réaliser en groupe ou seul, pour se dépasser et rester actif.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'category-5',
    name: 'Défis créatifs',
    description:
      'Des défis pour stimuler la créativité : arts, bricolage, cuisine, et plus encore.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'category-6',
    name: 'Défis intellectuels',
    description:
      'Des défis à réaliser en solo ou en équipe pour stimuler votre esprit et tester vos connaissances.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
