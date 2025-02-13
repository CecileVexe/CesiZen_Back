import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Recipe } from "@/utils/types/recipe.types";
import { IconButton } from "react-native-paper";
import { useRecipes } from "@/context/recipesContext";

interface RecipeCard {
  recipe: Recipe;
}
const RecipeCard = (props: RecipeCard) => {
  const { recipe } = props;
  const { removeRecipe } = useRecipes();
  const firstIngredient = recipe.ingredients[0];
  const secondIngredient = recipe.ingredients[1];

  return (
    <>
      <Text>Nombre d'ingrédients : {recipe.ingredientNumber}</Text>
      <Text>Calories : {recipe.kcal}</Text>
      <Text>Protéines : {recipe.proteins}g</Text>
      <Text>Graisses : {recipe.fat}g</Text>
      <Text>Glucides : {recipe.carbs}g</Text>

      <View style={styles.overlayContainer}>
        {firstIngredient && secondIngredient ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: firstIngredient.image }}
              style={[styles.image, styles.imageOverlay]}
            />
            <Image
              source={{ uri: secondIngredient.image }}
              style={[styles.image, styles.imageOverlay]}
            />
          </View>
        ) : (
          <Text>Pas assez d'ingrédients pour superposer des images</Text>
        )}
      </View>
      <IconButton icon="delete" onPress={() => removeRecipe(recipe.id)} />
    </>
  );
};

export default RecipeCard;

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
    height: 100, // Ajuster selon la taille que tu souhaites pour les images
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
