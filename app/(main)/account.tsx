import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { useAuth, useUser } from "@clerk/clerk-expo";

const Account = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <View>
      <Text>
        Email: {user?.primaryEmailAddress?.emailAddress ?? "Non disponible"}
      </Text>
      <Button mode="contained" onPress={() => signOut()}>
        Se déconnecter
      </Button>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({});
