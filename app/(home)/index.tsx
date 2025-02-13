import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, Button } from "react-native";
// import { Button } from "react-native-paper";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View>
      <Button title="signout" onPress={() => signOut()} />
    </View>
  );
}
