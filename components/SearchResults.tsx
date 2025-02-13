import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Text, List } from "react-native-paper";
import { Food, FoodResponse } from "@/utils/types/food.types";

interface SearchResultsProps {
  results: FoodResponse;
  addFood: (food: Food) => void;
}

const SearchResults = (props: SearchResultsProps) => {
  const { results, addFood } = props;
  const { hints: AllResult } = results;

  return (
    <View style={styles.container}>
      <FlatList
        data={AllResult}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Pressable onPress={() => addFood(item.food)}>
              <Image source={{ uri: item.food.image }} style={styles.image} />
              <Text style={styles.label}>{item.food.label}</Text>
            </Pressable>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
  },
});

export default SearchResults;
