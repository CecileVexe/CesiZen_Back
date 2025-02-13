import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, usePathname } from "expo-router";
import { useRecipes } from "@/context/recipesContext";
import { Recipe } from "@/utils/types/recipe.types";
import RecipeCard from "@/components/RecipeCard";
import IngredientsList from "@/components/IngredientsList";

const MealDetail = () => {
  const { id } = useLocalSearchParams<Record<string, string>>();
  const { getRecipeById } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe>();

  useEffect(() => {
    const recipeToDisplay = getRecipeById(id);
    if (recipeToDisplay) {
      setRecipe(recipeToDisplay);
    }
  }, [id, getRecipeById]);

  return (
    <View>
      {recipe && (
        <>
          <View
            style={{
              marginBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
              paddingBottom: 15,
            }}
          >
            <RecipeCard recipe={recipe} />
          </View>
          <IngredientsList data={recipe?.ingredients} />
        </>
      )}
    </View>
  );
};

export default MealDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  recipeContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  overlayContainer: {
    marginTop: 10,
  },
  imageContainer: {
    position: "relative",
    height: 100,
    width: 100,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  imageOverlay: {
    opacity: 0.8,
  },
});
