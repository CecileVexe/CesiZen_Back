import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { useAuth } from "@clerk/clerk-expo";

const Account = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button mode="contained" onPress={() => signOut()}>
        Se déconnecter
      </Button>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({});
