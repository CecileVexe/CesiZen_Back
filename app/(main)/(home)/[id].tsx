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
          <RecipeCard recipe={recipe} />
          <IngredientsList data={recipe?.ingredients} />
        </>
      )}
    </View>
  );
};

export default MealDetail;

const styles = StyleSheet.create({});
