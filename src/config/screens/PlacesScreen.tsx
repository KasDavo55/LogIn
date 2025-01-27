import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

const GOOGLE_API_KEY = "AIzaSyD7vUAMpM0jDN8LVyqNO3RhwLw7qBxhcNw"; // Reemplaza con tu clave de Google API

const PlacesScreen: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<{
    title: string;
    description: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const places = [
    {
      id: "1",
      title: "Michael's Restaurant",
      description: "Sector El Bosque",
      latitude: -0.15970223092655936,
      longitude: -78.49644625061103,
    },
    {
      id: "2",
      title: "Rock +",
      description: "Sector plataforma Gubernamental Norte",
      latitude: -0.17495115138316805,
      longitude: -78.483517089627,
    },
    {
      id: "3",
      title: "Pennyroyal Burger",
      description: "Sector Pampite, Cumbaya",
      latitude: -0.19539048045767224,
      longitude: -78.43478692031205,
    },
    {
      id: "4",
      title: "Chios Burger",
      description: "Sector Real audiencia",
      latitude: -0.13309749491117678,
      longitude: -78.48670697613412,
    },
    {
      id: "5",
      title: "Chub's Smash Burguers",
      description: "Sector Floresta",
      latitude: -0.20360336688719613,
      longitude: -78.48144881846252,
    },
  ];

  // Obtener la ubicación actual del usuario
  const toggleUserLocation = async () => {
    if (userLocation) {
      // Si ya está activada la ubicación, desactivarla
      setUserLocation(null);
      Alert.alert("Ubicación desactivada", "Ya no se mostrarán rutas.");
    } else {
      // Si no está activada, activarla
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Se requiere acceso a tu ubicación para calcular las rutas."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        Alert.alert("Ubicación activada", "Tu ubicación se ha activado.");
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        Alert.alert("Error", "No se pudo obtener tu ubicación.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {selectedPlace ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedPlace.latitude,
              longitude: selectedPlace.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Muestra el marcador del lugar seleccionado */}
            <Marker
              coordinate={{
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
              }}
              title={selectedPlace.title}
              description={selectedPlace.description}
            />

            {/* Si el usuario ya activó su ubicación, muestra la ruta */}
            {userLocation && (
              <>
                <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  title="Mi Ubicación"
                />
                <MapViewDirections
                  origin={userLocation}
                  destination={{
                    latitude: selectedPlace.latitude,
                    longitude: selectedPlace.longitude,
                  }}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={5}
                  strokeColor="blue"
                  onError={(errorMessage) => {
                    console.error("Error al calcular la ruta:", errorMessage);
                    Alert.alert("Error", "No se pudo calcular la ruta.");
                  }}
                />
              </>
            )}
          </MapView>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPlace(null)}
          >
            <Text style={styles.backButtonText}>Volver a la lista</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={places}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.placeItem}
                onPress={() => setSelectedPlace(item)}
              >
                <Text style={styles.placeTitle}>{item.title}</Text>
                <Text style={styles.placeDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[
              styles.locationButton,
              userLocation ? styles.locationButtonActive : styles.locationButtonInactive,
            ]}
            onPress={toggleUserLocation}
          >
            <Text style={styles.locationButtonText}>
              {userLocation ? "Desactivar mi ubicación" : "Activar mi ubicación"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
  },
  placeItem: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#841584",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  locationButtonActive: {
    backgroundColor: "#d9534f", // Rojo para "Desactivar"
  },
  locationButtonInactive: {
    backgroundColor: "#5cb85c", // Verde para "Activar"
  },
  locationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PlacesScreen;
