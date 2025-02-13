import axios from "axios";
import { Alert } from "react-native";

const apiKey = process?.env.EXPO_PUBLIC_API_KEY;
const appId = process?.env.EXPO_PUBLIC_API_ID;

export const searchFood = async (query: string) => {
  console.log(query, appId);
  if (!query) {
    Alert.alert("Erreur", "Veuillez entrer un aliment à rechercher");
    return null;
  }

  try {
    const response = await axios.get(
      "https://api.edamam.com/api/food-database/v2/parser",
      {
        params: {
          app_id: appId,
          app_key: apiKey,
          ingr: query,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
    Alert.alert("Erreur", "Impossible de récupérer les données");
    return null;
  }
};
