import RecipeCard from "@/components/RecipeCard";
import { useRecipes } from "@/context/recipesContext";
import { Recipe } from "@/utils/types/recipe.types";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, Button, StyleSheet, Image, FlatList } from "react-native";

export default function Page() {
  const { recipes } = useRecipes();

  const renderItem = ({ item }: { item: Recipe }) => {
    return (
      <Link href={`/${item.id}`} style={styles.recipeContainer}>
        <RecipeCard recipe={item} />
      </Link>
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
