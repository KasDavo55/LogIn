import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./src/config/config/firebase";
import LoginScreen from "./src/config/screens/LoginScreen";
import SignUpScreen from "./src/config/screens/SignUpScreen";
import HomeScreen from "./src/config/screens/HomeScreen";
import RecordingScreen from "./src/config/screens/RecordingScreen"; 
import PlacesScreen from "./src/config/screens/PlacesScreen";

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            {/* Pantalla principal */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "Inicio" }}
            />

            {/* Pantalla de grabación */}
            <Stack.Screen
              name="RecordingScreen"
              component={RecordingScreen}
              options={{ title: "Grabación de Audio" }}
            />
            <Stack.Screen name="PlacesScreen" component={PlacesScreen} 
            options={{ title: "Lugares" }} />
            
          </>
        ) : (
          <>
            {/* Pantallas de autenticación */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: "Crear Cuenta" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
