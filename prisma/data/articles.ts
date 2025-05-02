const titlesAndContents = [
  {
    title: 'Les bienfaits de la méditation quotidienne',
    content:
      'La méditation réduit le stress et améliore la concentration. Pratiquée quotidiennement, elle favorise une meilleure santé mentale.',
  },
  {
    title: 'La pleine conscience pour gérer les pensées négatives',
    content:
      'La pleine conscience aide à identifier les pensées négatives sans les nourrir, réduisant anxiété et ruminations.',
  },
  {
    title: 'Comment améliorer son sommeil naturellement',
    content:
      'Limiter les écrans, respecter un horaire régulier et créer un environnement propice favorisent un meilleur sommeil.',
  },
  {
    title: 'Construire une routine bien-être efficace',
    content:
      'Une routine structurée incluant sommeil, repos et détente permet une meilleure récupération mentale.',
  },
  {
    title: 'L’impact de l’alimentation sur la santé mentale',
    content:
      'Une alimentation riche en nutriments améliore l’humeur, réduit l’anxiété et soutient le cerveau.',
  },
  {
    title: 'Les effets du sucre sur l’humeur',
    content:
      'Une consommation excessive de sucre peut provoquer des sautes d’humeur et de l’irritabilité.',
  },
  {
    title: 'L’exercice physique : un antidépresseur naturel',
    content:
      'Le sport stimule la production d’endorphines, réduit le stress et favorise le bien-être général.',
  },
  {
    title: 'Bouger même sans sport : l’importance de l’activité légère',
    content:
      'Marcher, jardiner ou faire du ménage réduit le stress et contribue à la santé mentale.',
  },
  {
    title: 'Apprendre à dire non pour préserver sa santé mentale',
    content:
      'Dire non permet de fixer ses limites et de se protéger émotionnellement.',
  },
  {
    title: 'Le rôle du journaling dans le bien-être émotionnel',
    content:
      'Écrire ses émotions permet de les comprendre et d’alléger les tensions psychiques.',
  },
];

export function generateArticlesSeed(
  categoryIds: string[],
  bannerIds?: string[],
) {
  if (!categoryIds.length) {
    throw new Error('Le tableau de categoryIds ne peut pas être vide.');
  }

  const articles = titlesAndContents.map((entry, i) => {
    // const randomBannerId =
    //   bannerIds.length > 0
    //     ? bannerIds[Math.floor(Math.random() * bannerIds.length)]
    //     : undefined;

    return {
      title: entry.title,
      content: entry.content,
      categoryId: categoryIds[i % categoryIds.length],
      //   bannerId: randomBannerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return articles;
}
