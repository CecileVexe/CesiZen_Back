import {
  Role as RoleModel,
  User as UserModel,
  Favorite as FavoriteModel,
  Article as ArticleModel,
  Image as ImageModel,
  ArticleCategory as ArticleCategoryModel,
  EmotionCategory as EmotionCategoryModel,
  Emotion as EmotionModel,
  JournalEntry as JournalEntryModel,
} from '@prisma/client';

export interface UserType
  extends Omit<
    UserModel,
    'id' | 'roleId' | 'createdAt' | 'updatedAt' | 'clerkId'
  > {
  role: Omit<RoleModel, 'createdAt' | 'updatedAt'>;
}

export interface ArticleType
  extends Omit<
    ArticleModel,
    'id' | 'category' | 'categoryId' | 'createdAt' | 'updatedAt' | 'banner'
  > {
  category: Omit<CategoryType, 'description'>;
}

export interface EmotionType
  extends Omit<
    EmotionModel,
    'createdAt' | 'updatedAt' | 'category' | 'entries'
  > {
  emotionCategory: EmotionCategoryType;
}

export type CategoryType = Omit<
  ArticleCategoryModel,
  'createdAt' | 'updatedAt' | 'Article'
>;

export type EmotionCategoryType = Omit<
  EmotionCategoryModel,
  'createdAt' | 'updatedAt' | 'emotions'
>;

export type FavoriteType = Omit<
  FavoriteModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export type JournalEntryType = Omit<
  JournalEntryModel,
  'createdAt' | 'journal' | 'journalId' | 'emotion'
>;
