import { useRecipes } from "@/context/recipesContext";
import { Recipe } from "@/utils/types/recipe.types";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, Button, StyleSheet, Image, FlatList } from "react-native";
// import { Button } from "react-native-paper";

export default function Page() {
  const { recipes } = useRecipes();

  console.log(recipes);

  const renderItem = ({ item }: { item: Recipe }) => {
    const firstIngredient = item.ingredients[0];
    const secondIngredient = item.ingredients[1];

    return (
      <View style={styles.recipeContainer}>
        <Text>Nombre d'ingrédients : {item.ingredientNumber}</Text>
        <Text>Calories : {item.kcal}</Text>
        <Text>Protéines : {item.proteins}g</Text>
        <Text>Graisses : {item.fat}g</Text>
        <Text>Glucides : {item.carbs}g</Text>

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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text>Créez votre première recette !</Text>
      )}
    </View>
  );
}

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
