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
    <View
      style={{
        flexDirection: "row",
        paddingVertical: 15,
      }}
    >
      <View style={styles.container}>
        <View style={styles.overlayContainer}>
          {firstIngredient && secondIngredient ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: firstIngredient.image }}
                style={[styles.image1]}
              />
              <Image
                source={{ uri: secondIngredient.image }}
                style={[styles.image2]}
              />
            </View>
          ) : (
            <Image
              source={{ uri: firstIngredient.image }}
              style={[styles.image1]}
            />
          )}
        </View>
      </View>
      <View>
        <Text>Nombre d'ingrédients : {recipe.ingredientNumber}</Text>
        <Text>Calories : {recipe.kcal}</Text>
        <Text>Protéines : {recipe.proteins}g</Text>
        <Text>Graisses : {recipe.fat}g</Text>
        <Text>Glucides : {recipe.carbs}g</Text>
      </View>
      <IconButton icon="delete" onPress={() => removeRecipe(recipe.id)} />
    </View>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },

  overlayContainer: {
    marginTop: 10,
  },
  imageContainer: {
    position: "relative",
    height: 50,
    width: 50,
    margin: 10,
  },
  image1: {
    position: "absolute",
    top: 10,
    left: 10,
    height: 50,
    width: 50,
    borderRadius: 8,
  },
  image2: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 50,
    width: 50,
    borderRadius: 8,
  },
});
