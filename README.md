# Cesizen API

API développée avec **NestJS**, **Prisma** et **Clerk** pour l'authentification.  
Cette API alimente une application mobile et un back-office web.

---

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Nest](https://github.com/nestjs/nest)
- [MySQL](https://www.mysql.com/)
- [Prisma CLI](https://www.prisma.io/docs)
- Un compte [Clerk](https://clerk.dev/) configuré

---

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/CecileVexe/CesiZen_Back.git
cd CesiZen_Back
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn
```

### 3. Configurer les variables d’environnement

```bash
DATABASE_URL=mysql://user:password@localhost:3306/[NOM DE LA BASE]

CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

## 🧱 Prisma

### Générer le client Prisma

```bash
npx prisma generate
```
### Exécuter les migrations

```bash
npx prisma migrate dev
```

### Exécuter les seed de la base (optionnel)

```bash
npm run prisma
```

## 🚀 Démarrage

```bash
Lancer le serveur en mode développement
```

## 🔑 Authentification Clerk

Cette API utilise [Clerk](https://clerk.com/) pour gérer l’authentification :

CLERK_SECRET_KEY doit être défini dans .env

Synchronisation des utilisateurs avec la base de données manuellement ou via webhook (selon ton implémentation)

📚 Voir la documentation [Clerk Backend](https://clerk.com/docs/references/backend/overview) pour en savoir plus.

## 🧪 Tests

### Lancer tous les tests unitaires

```bash
npm run test
```
### Mode interactif

```bash
npm run test:watch
```

### Mode coverage

```bash
npm run test:cov
```

## 🧾 Licence
### Ce projet est sous licence UNLICENSED.
