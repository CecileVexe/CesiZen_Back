import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { Food } from "@/utils/types/food.types";
import { Recipe } from "@/utils/types/recipe.types";
import { useRecipes } from "@/context/recipesContext";
import IngredientsList from "./IngredientsList";

interface NewRecipeProps {
  newRecipe: Food[];
  createRecipe: (newRecipe: Food[]) => Recipe;
}

const NewRecipe = (props: NewRecipeProps) => {
  const { newRecipe, createRecipe } = props;
  const { addToRecipes } = useRecipes();

  return (
    <View style={styles.container}>
      {newRecipe.length > 0 ? (
        <>
          <IngredientsList data={newRecipe} />
          <Button onPress={() => addToRecipes(createRecipe(newRecipe))}>
            Créer une recette
          </Button>
        </>
      ) : (
        <Text style={styles.emptyText}>
          Chercher ou Scanner un ingrédient pour créer votre recette
        </Text>
      )}
      <Button>Ajouter la recette</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  nutrientText: {
    fontSize: 14,
    color: "gray",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
});

export default NewRecipe;
