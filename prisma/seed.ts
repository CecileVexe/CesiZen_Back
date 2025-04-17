// import { PrismaClient } from '@prisma/client';
// import { createUser } from './data/user';
// import { generateArticlesSeed } from './data/resssource';
// import { categories } from './data/categories';

// const prisma = new PrismaClient();

// async function main() {
//   const admin = await prisma.role.upsert({
//     where: { name: 'ADMIN' },
//     update: {},
//     create: {
//       name: 'ADMIN',
//     },
//   });
//   const moderator = await prisma.role.upsert({
//     where: { name: 'MODERATOR' },
//     update: {},
//     create: {
//       name: 'MODERATOR',
//     },
//   });

//   const user = await prisma.role.upsert({
//     where: { name: 'USER' },
//     update: {},
//     create: {
//       name: 'USER',
//     },
//   });

//   void createUser([admin, moderator, user]);

//   await prisma.category.createMany({
//     data: categories,
//   });

//   console.log('Les catégories ont été insérées avec succès !');

//   const Articles = generateArticlesSeed(categories.map((cat) => cat.id));

//   // Insérer les Articles dans la base de données
//   await prisma.Article.createMany({
//     data: Articles,
//   });

//   console.log('Les Articles ont été insérées avec succès !');
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
