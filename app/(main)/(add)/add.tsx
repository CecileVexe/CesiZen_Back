import NewRecipe from "@/components/NewRecipe";
import SearchResults from "@/components/SearchResults";
import { useRecipes } from "@/context/recipesContext";
import { searchFood } from "@/services/edamam.services";
import { Food, FoodResponse } from "@/utils/types/food.types";
import { Recipe } from "@/utils/types/recipe.types";
import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { roundDecimal } from "@/utils/roundDecimal";
import { useRouter } from "expo-router";

const AddFoodScreen = () => {
  const [query, setQuery] = useState("");
  const [food, setFood] = useState<FoodResponse | undefined>(undefined);
  const { addFoodToRecipe, newRecipe } = useRecipes();
  const router = useRouter();

  const getQueryResults = async () => {
    const results = await searchFood(query);
    setFood(results);
  };

  const createRecipe = (newRecipe: Food[]): Recipe => {
    const kcal = newRecipe.reduce(
      (total, food) => total + food.nutrients.ENERC_KCAL,
      0
    );
    const proteins = newRecipe.reduce(
      (total, food) => total + food.nutrients.PROCNT,
      0
    );
    const carbs = newRecipe.reduce(
      (total, food) => total + food.nutrients.CHOCDF,
      0
    );
    const fat = newRecipe.reduce(
      (total, food) => total + food.nutrients.FAT,
      0
    );

    const myuuid = uuidv4();

    return {
      id: myuuid,
      ingredients: newRecipe,
      ingredientNumber: newRecipe.length,
      kcal: roundDecimal(kcal),
      proteins: roundDecimal(proteins),
      carbs: roundDecimal(carbs),
      fat: roundDecimal(fat),
    };
  };

  const addFood = (food: Food) => {
    addFoodToRecipe(food);
    setQuery("");
    setFood(undefined);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Recipe name"
        mode="outlined"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={() => getQueryResults()}
        style={styles.button}
      >
        Search
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/camera")}
        style={styles.scanButton}
      >
        Scan 📸
      </Button>
      {food ? (
        <SearchResults results={food} addFood={addFood} />
      ) : (
        newRecipe && (
          <NewRecipe newRecipe={newRecipe} createRecipe={createRecipe} />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginBottom: 10,
  },
  scanButton: {
    width: "100%",
    backgroundColor: "black",
  },
});

export default AddFoodScreen;
