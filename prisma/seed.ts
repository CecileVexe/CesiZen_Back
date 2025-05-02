import ora from 'ora';
import { PrismaClient } from '@prisma/client';
import { createUser } from './data/user';
import { articleCategories } from './data/categories';
import { generateArticlesSeed } from './data/articles';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';
import { emotionCategoriesSeedData } from './data/emotionAndCategories';
import { generateJournalEntries } from './data/journalEntries';

const prisma = new PrismaClient();
const userService = new UserService(new PrismaService(), new ClerkService());

async function main() {
  const spinner = ora('Suppression des anciennes données...').start();

  await prisma.favorite.deleteMany();
  await prisma.user.deleteMany();
  await prisma.article.deleteMany();
  await prisma.role.deleteMany();
  await prisma.articleCategory.deleteMany();
  await prisma.emotion.deleteMany();
  await prisma.emotionCategory.deleteMany();
  await prisma.emotionalJournal.deleteMany();
  await prisma.journalEntry.deleteMany();
  await prisma.image.deleteMany();

  spinner.succeed('Toutes les données ont été supprimées avec succès !');

  spinner.start('Création des rôles...');
  const admin = await prisma.role.create({ data: { name: 'ADMIN' } });
  const user = await prisma.role.create({ data: { name: 'USER' } });
  spinner.succeed('Rôles créés !');

  spinner.start('Création des utilisateurs...');
  await createUser([admin, user]);
  spinner.succeed('Utilisateurs créés !');

  spinner.start('Création de l’utilisateur Demo Clerk...');
  await userService.createWithClerk({
    clerkId: 'user_2wXtQzjfbu6qHhufUqiB5K4BnK8',
  });
  spinner.succeed('Utilisateur Demo Clerk créé !');

  const demoUser = await prisma.user.findUnique({
    where: { clerkId: 'user_2wXtQzjfbu6qHhufUqiB5K4BnK8' },
  });

  if (!demoUser) throw new Error('Utilisateur demo introuvable.');

  spinner.start('Création des catégories d’articles...');
  const createdCategories = await Promise.all(
    articleCategories.map((category) =>
      prisma.articleCategory.create({ data: category }),
    ),
  );
  spinner.succeed('Catégories d’articles créées !');

  const categoryIds = createdCategories.map((cat) => cat.id);

  spinner.start('Création des articles...');
  const articlesData = generateArticlesSeed(categoryIds);
  for (const article of articlesData) {
    await prisma.article.create({ data: article });
  }
  spinner.succeed('Articles créés !');

  spinner.start('Ajout des articles aux favoris...');
  const articles = await prisma.article.findMany({ take: 5 });
  for (const article of articles) {
    await prisma.favorite.create({
      data: {
        userId: demoUser.id,
        articleId: article.id,
      },
    });
  }
  spinner.succeed('Favoris ajoutés !');

  spinner.start('Seed des émotions et des catégories...');
  for (const category of emotionCategoriesSeedData) {
    const createdCategory = await prisma.emotionCategory.create({
      data: {
        name: category.name,
        color: category.color,
      },
    });

    for (const emotionName of category.emotions) {
      await prisma.emotion.create({
        data: {
          name: emotionName,
          color: createdCategory.color,
          smiley: category.smiley,
          emotionCategoryId: createdCategory.id,
        },
      });
    }
  }
  spinner.succeed('Émotions seedées !');

  spinner.start('Création du journal émotionnel...');
  let journal = await prisma.emotionalJournal.findFirst({
    where: { userId: demoUser.id },
  });

  if (!journal) {
    journal = await prisma.emotionalJournal.create({
      data: {
        userId: demoUser.id,
      },
    });
  }

  const emotions = await prisma.emotion.findMany();
  const journalEntries = generateJournalEntries(journal.id, emotions);
  await prisma.journalEntry.createMany({
    data: journalEntries,
    skipDuplicates: true,
  });

  spinner.succeed('Journal émotionnel complété !');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
