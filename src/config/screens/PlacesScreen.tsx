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
