import NewRecipe from "@/components/NewRecipe";
import SearchResults from "@/components/SearchResults";
import { searchFood } from "@/services/edamam.services";
import { Food, FoodResponse } from "@/utils/types/food.types";
import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";

const AddFoodScreen = () => {
  const [query, setQuery] = useState("");
  const [food, setFood] = useState<FoodResponse | undefined>(undefined);
  const [newRecipe, setNewRecipe] = useState<Array<Food>>([]);

  const getQueryResults = async () => {
    const results = await searchFood(query);
    setFood(results);
  };

  const addFood = (food: Food) => {
    Alert.alert("Ajout", `Ajout du plat : ${food.label}`);
    setNewRecipe([...newRecipe, food]);
    setQuery("");
    setFood(undefined);
  };

  console.log(newRecipe);

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
        onPress={() => Alert.alert("Scan en cours...")}
        style={styles.scanButton}
      >
        Scan 📸
      </Button>
      {food ? (
        <SearchResults results={food} addFood={addFood} />
      ) : (
        <NewRecipe newRecipe={newRecipe} />
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
