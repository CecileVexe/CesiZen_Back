import { Food } from "@/utils/types/food.types";
import { Recipe } from "@/utils/types/recipe.types";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface RecipesContextType {
  recipes: Recipe[];
  addToRecipes: (newRecipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  getRecipeById: (recipeId: string) => Recipe | null;
  newRecipe: Food[];
  addFoodToRecipe: (food: Food) => void;
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

interface RecipesProviderProps {
  children: ReactNode;
}

export const RecipesProvider = ({ children }: RecipesProviderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newRecipe, setNewRecipe] = useState<Food[]>([]);

  const addFoodToRecipe = (food: Food) => {
    setNewRecipe([...newRecipe, food]);
  };

  const addToRecipes = (newRecipe: Recipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
  };

  const removeRecipe = (id: string) => {
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe.id !== id)
    );
  };

  const getRecipeById = (recipeId: string) => {
    const recipe = recipes.find((recipe) => recipe.id === recipeId);
    if (recipe === undefined) {
      alert("Recette introuvable");
      return null;
    } else {
      return recipe;
    }
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        addToRecipes,
        removeRecipe,
        getRecipeById,
        newRecipe,
        addFoodToRecipe,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
