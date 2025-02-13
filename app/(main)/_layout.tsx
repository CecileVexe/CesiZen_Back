import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/sign-in"} />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Meals",

          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="home" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="(add)"
        options={{
          title: "Ajouter",
          headerShown: false,
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="cog" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Profil",
          // tabBarIcon: ({ color }) => (
          //   <FontAwesome size={28} name="home" color={color} />
          // ),
        }}
      />
    </Tabs>
  );

  // return <Stack />;
}
