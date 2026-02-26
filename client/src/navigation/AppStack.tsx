import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

// Add more post-auth screens here as your app grows
export type AppStackParamList = {
  Home: undefined;
  // Profile: undefined;
  // Settings: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* Add more post-auth screens here */}
    </Stack.Navigator>
  );
};

export default AppStack;