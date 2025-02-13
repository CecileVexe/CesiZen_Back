export interface FoodResponse {
  hints: Hint[];
}

export interface Hint {
  food: Food;
  measures: Measure[];
}

export interface Food {
  foodId: string;
  label: string;
  knownAs: string;
  nutrients: Nutrients;
  category: string;
  categoryLabel: string;
  image?: string;
}

export interface Nutrients {
  ENERC_KCAL: number;
  PROCNT: number;
  FAT: number;
  CHOCDF: number;
  FIBTG: number;
}

export interface Measure {
  uri: string;
  label: string;
  weight: number;
  qualified?: QualifiedMeasure[];
}

export interface QualifiedMeasure {
  qualifiers: Qualifier[];
  weight: number;
}

export interface Qualifier {
  uri: string;
  label: string;
}
