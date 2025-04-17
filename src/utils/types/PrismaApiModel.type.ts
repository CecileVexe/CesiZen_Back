import {
  Role as RoleModel,
  Citizen as CitizenModel,
  Comment as CommentModel,
  File as FileModel,
  Ressource as ResourceModel,
  Step as StepModel,
  Progression as ProgressionModel,
  Category as CategoryModel,
  Favorite as FavoriteModel,
  Message as MessageModel,
} from '@prisma/client';

export interface CitizenType
  extends Omit<
    CitizenModel,
    'id' | 'password' | 'roleId' | 'createdAt' | 'updatedAt' | 'clerkId'
  > {
  role: Omit<RoleModel, 'createdAt' | 'updatedAt'>;
}

export interface RessourceType
  extends Omit<
    ResourceModel,
    | 'id'
    | 'category'
    | 'categoryId'
    | 'createdAt'
    | 'updatedAt'
    | 'fileId'
    | 'banner'
    | 'bannerId'
    | 'file'
    | 'comment'
  > {
  file?: Omit<FileModel, 'resources'> | null;
  step: Array<Omit<StepModel, 'ressourceId'> | null>;
}

export interface RessourceWithCommentType extends RessourceType {
  comment: Array<RessourceComment | null>;
}

interface RessourceComment
  extends Omit<
    CommentModel,
    'createdAt' | 'ressourceId' | 'citizen' | 'citizenId'
  > {
  citizen: Pick<CitizenModel, 'name' | 'surname'>;
}

export type FileType = Omit<FileModel, 'resources'>;

export interface CommentType
  extends Omit<CommentModel, 'citizenId' | 'createdAt'> {
  citizen: Omit<
    CitizenType,
    | 'role'
    | 'createdAt'
    | 'updatedAt'
    | 'password'
    | 'roleId'
    | 'email'
    | 'id'
    | 'comment'
  >;
}

export type CategoryType = Omit<
  CategoryModel,
  'createdAt' | 'updatedAt' | 'ressource'
>;

export type ProgressionType = Omit<ProgressionModel, 'createdAt' | 'updatedAd'>;

export type StepType = Omit<StepModel, 'id'>;

export type FavoriteType = Omit<FavoriteModel, 'id' | 'createdAt'| 'updatedAt'> 

export interface MessageType extends Omit<MessageModel,'id' | 'citizenId' | 'updatedAt'> {
  citizen: Omit<CitizenType, 'role' | 'createdAt' | 'updatedAt' | 'password' | 'roleId' | 'email' | 'id' | 'roleId' | 'Comment'>;}

