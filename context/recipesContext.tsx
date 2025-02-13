import { Food } from "@/utils/types/food.types";
import { Recipe } from "@/utils/types/recipe.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
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
  const router = useRouter();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("recipes");
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des recettes :", error);
      }
    };
    loadRecipes();
  }, []);

  const saveRecipesToStorage = async (recipes: Recipe[]) => {
    try {
      await AsyncStorage.setItem("recipes", JSON.stringify(recipes));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des recettes :", error);
    }
  };

  const addFoodToRecipe = (food: Food) => {
    setNewRecipe([...newRecipe, food]);
  };

  const addToRecipes = (newRecipe: Recipe) => {
    setRecipes((prevRecipes) => {
      const updatedRecipes = [...prevRecipes, newRecipe];
      saveRecipesToStorage(updatedRecipes);
      setNewRecipe([]);
      return updatedRecipes;
    });
    router.navigate("/");
  };

  const removeRecipe = (id: string) => {
    setRecipes((prevRecipes) => {
      const updatedRecipes = prevRecipes.filter((recipe) => recipe.id !== id);
      saveRecipesToStorage(updatedRecipes);
      router.navigate("/");
      return updatedRecipes;
    });
  };

  const getRecipeById = (recipeId: string) => {
    const recipe = recipes.find((recipe) => recipe.id === recipeId);

    if (recipe === undefined) {
      router.navigate("/");
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
