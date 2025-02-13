import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Text, Card } from "react-native-paper";
import { Food } from "@/utils/types/food.types";

interface NewRecipeProps {
  newRecipe: Food[];
}

const NewRecipe = (props: NewRecipeProps) => {
  const { newRecipe } = props;

  return (
    <View style={styles.container}>
      {newRecipe.length > 0 ? (
        <FlatList
          data={newRecipe}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.nutrientText}>
                  Protein: {item.nutrients.PROCNT} g
                </Text>
                <Text style={styles.nutrientText}>
                  Fat: {item.nutrients.FAT} g
                </Text>
                <Text style={styles.nutrientText}>
                  Carbs: {item.nutrients.CHOCDF} g
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.foodId}
        />
      ) : (
        <Text style={styles.emptyText}>
          Chercher ou Scanner un ingrédient pour créer votre recette
        </Text>
      )}
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
