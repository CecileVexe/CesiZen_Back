import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Meals",
          headerShown: false,
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="home" color={color} />
          // ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Details",
          headerShown: false,
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="home" color={color} />
          // ),
        }}
      />
    </Stack>
  );

  // return <Stack />;
}
