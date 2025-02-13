import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";

const Account = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Text>
        Email: {user?.primaryEmailAddress?.emailAddress ?? "Non disponible"}
      </Text>
      <Button mode="contained" onPress={() => signOut()} style={styles.button}>
        Se déconnecter
      </Button>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 16,
  },
});
