import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const PlacesScreen: React.FC = () => {
  const [selectedPlace, setSelectedPlace] = useState<{
    title: string;
    description: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  // Lista de lugares
  const places = [
    {
      id: "1",
      title: "Central Park",
      description: "Un lugar icónico en Nueva York",
      latitude: 40.785091,
      longitude: -73.968285,
    },
    {
      id: "2",
      title: "Torre Eiffel",
      description: "Un lugar emblemático en París",
      latitude: 48.858844,
      longitude: 2.294351,
    },
    {
      id: "3",
      title: "Taj Mahal",
      description: "Un lugar hermoso en la India",
      latitude: 27.175144,
      longitude: 78.042142,
    },
    {
      id: "4",
      title: "Gran Muralla China",
      description: "Un sitio histórico en China",
      latitude: 40.431908,
      longitude: 116.570374,
    },
    {
      id: "5",
      title: "Ópera de Sídney",
      description: "Un icono en Australia",
      latitude: -33.856784,
      longitude: 151.215297,
    },
  ];

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
              title={selectedPlace.title}
              description={selectedPlace.description}
            />
          </MapView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPlace(null)}
          >
            <Text style={styles.backButtonText}>Volver a la lista</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
});

export default PlacesScreen;
