import { Food } from "./food.types";

export interface Recipe {
  id: string;
  ingredients: Food[];
  ingredientNumber: number;
  kcal: number;
  proteins: number;
  fat: number;
  carbs: number;
}
