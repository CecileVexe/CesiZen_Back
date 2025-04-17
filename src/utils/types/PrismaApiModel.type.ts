import {
  Role as RoleModel,
  User as UserModel,
  Favorite as FavoriteModel,
  Article as ArticleModel,
  Image as ImageModel,
  ArticleCategory as ArticleCategoryModel,
  EmotionCategory as EmotionCategoryModel,
} from '@prisma/client';

export interface UserType
  extends Omit<
    UserModel,
    'id' | 'password' | 'roleId' | 'createdAt' | 'updatedAt' | 'clerkId'
  > {
  role: Omit<RoleModel, 'createdAt' | 'updatedAt'>;
}

export interface ArticleType
  extends Omit<
    ArticleModel,
    | 'id'
    | 'category'
    | 'categoryId'
    | 'createdAt'
    | 'updatedAt'
    | 'banner'
    | 'bannerId'
  > {
  banner: Omit<ImageModel, 'id' | 'articles'> | null;
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
