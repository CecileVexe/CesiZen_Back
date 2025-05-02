// prisma/data/journalEntriesData.ts

import { Emotion } from '@prisma/client';

const descriptionsByEmotion: Record<string, string[]> = {
  Fierté: ['Je suis fier de ce que j’ai accompli aujourd’hui.'],
  Contentement: ['Une journée paisible, je me sens simplement bien.'],
  Enchantement: ['Quel moment magique ce matin en me promenant !'],
  Excitation: ['Je suis plein d’énergie, j’ai hâte de demain.'],
  Émerveillement: ['J’ai été émerveillé par la beauté du coucher de soleil.'],
  Gratitude: ['Je ressens beaucoup de gratitude pour les gens autour de moi.'],

  Frustration: ['J’ai l’impression de tourner en rond, ça m’agace.'],
  Colère: ['Je suis vraiment en colère après cette injustice.'],
  Irritation: ['Tout m’énerve aujourd’hui, même les petites choses.'],
  Rage: ['Une explosion intérieure, difficile à contenir.'],
  Ressentiment: ['Je rumine encore cette remarque désagréable.'],
  Agacement: ['Les petits imprévus s’accumulent, je suis agacé.'],
  Hostilité: ['Je me sens agressif, prêt à m’opposer à tout.'],

  Inquiétude: ['J’ai ce sentiment constant qu’un problème approche.'],
  Peur: ['Je suis paralysé par la peur de l’échec.'],
  Anxiété: ['Le stress me ronge toute la journée.'],
  Terreur: ['Un cauchemar m’a laissé une sensation d’angoisse.'],
  Appréhension: ['J’ai peur de ce que demain peut m’apporter.'],
  Panique: ['Je me suis senti submergé par la panique au travail.'],
  Crainte: ['Je crains que mes efforts ne suffisent pas.'],

  Chagrin: ['Une profonde tristesse m’a envahi aujourd’hui.'],
  Tristesse: ['Je me sens mélancolique sans raison apparente.'],
  Mélancolie: ['Les souvenirs me rendent nostalgique et triste.'],
  Abattement: ['Je n’ai plus la force de faire quoi que ce soit.'],
  Désespoir: ['J’ai perdu tout espoir aujourd’hui.'],
  Solitude: ['Je me suis senti incroyablement seul.'],
  Dépression: ['Tout semble vide et lourd autour de moi.'],

  Étonnement: ['Un événement inattendu m’a laissé sans voix.'],
  Surprise: ['Je ne m’attendais pas à cette bonne nouvelle !'],
  Stupéfaction: ['C’est incroyable ce qui s’est passé aujourd’hui.'],
  Sidération: ['Je suis resté figé, incapable de réagir.'],
  Incrédule: ['J’ai du mal à croire ce que j’ai entendu.'],
  Confusion: ['Je suis confus, tout semble flou.'],

  Répulsion: ['Quelque chose m’a profondément écœuré.'],
  Dégoût: ['Une situation m’a causé un vrai malaise.'],
  Déplaisir: ['Je n’ai tiré aucun plaisir de ce que j’ai fait.'],
  Nausée: ['Je me sentais mal physiquement et moralement.'],
  Dédain: ['Je n’ai eu que du mépris pour cette attitude.'],
  Horreur: ['Une scène m’a vraiment choqué.'],
  'Dégoût profond': ['Je ne peux pas supporter ce que j’ai vu.'],
};

export function generateJournalEntries(
  journalId: string,
  emotions: Emotion[],
): {
  description: string;
  date: Date;
  emotionId: string;
  journalId: string;
  createdAt: Date;
  updatedAt: Date;
}[] {
  const entries: {
    description: string;
    date: Date;
    emotionId: string;
    journalId: string;
    createdAt: Date;
    updatedAt: Date;
  }[] = [];

  const startDate = new Date('2025-03-01');
  const endDate = new Date('2025-04-30');

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const descriptions = descriptionsByEmotion[randomEmotion.name];
    const description = descriptions
      ? descriptions[Math.floor(Math.random() * descriptions.length)]
      : 'Je ressens quelque chose de difficile à décrire.';

    entries.push({
      description,
      date: new Date(d), // copy date
      emotionId: randomEmotion.id,
      journalId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return entries;
}
