import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { getDatabase, ref, onValue } from "firebase/database";

const GOOGLE_API_KEY = "AIzaSyD7vUAMpM0jDN8LVyqNO3RhwLw7qBxhcNw"; // Reemplaza con tu clave de Google API

const PlacesScreen: React.FC = () => {
  const [places, setPlaces] = useState<
    {
      id: string;
      name: string;
      description: string;
      latitude: number;
      longitude: number;
    }[]
  >([]);
  const [selectedPlace, setSelectedPlace] = useState<{
    name: string;
    description: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocationActive, setIsLocationActive] = useState(false);

  useEffect(() => {
    // Conectar a Firebase para obtener los lugares
    const fetchPlaces = async () => {
      try {
        const db = getDatabase();
        const placesRef = ref(db, "places");

        onValue(placesRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const loadedPlaces = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setPlaces(loadedPlaces);
          } else {
            setPlaces([]);
            Alert.alert("Aviso", "No hay lugares guardados.");
          }
        });
      } catch (error) {
        console.error("Error al obtener los lugares:", error);
        Alert.alert("Error", "No se pudieron cargar los lugares.");
      }
    };

    fetchPlaces();
  }, []);

  const toggleUserLocation = async () => {
    if (isLocationActive) {
      // Desactivar ubicación
      setUserLocation(null);
      setIsLocationActive(false);
      Alert.alert("Ubicación desactivada", "Ya no se mostrarán rutas.");
    } else {
      // Activar ubicación
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Se requiere acceso a tu ubicación para calcular rutas."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setUserLocation({ latitude, longitude });
        setIsLocationActive(true);
        Alert.alert("Ubicación activada", "Tu ubicación se ha activado.");
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        Alert.alert("Error", "No se pudo activar tu ubicación.");
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
            <Marker
              coordinate={{
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
              }}
              title={selectedPlace.name}
              description={selectedPlace.description}
            />
            {/* Mostrar ruta si la ubicación del usuario está activa */}
            {isLocationActive && userLocation && (
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
                <Text style={styles.placeTitle}>{item.name}</Text>
                <Text style={styles.placeDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[
              styles.locationButton,
              isLocationActive
                ? styles.locationButtonActive
                : styles.locationButtonInactive,
            ]}
            onPress={toggleUserLocation}
          >
            <Text style={styles.locationButtonText}>
              {isLocationActive ? "Desactivar mi ubicación" : "Activar mi ubicación"}
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
    width: "100%",
    height: "100%",
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
