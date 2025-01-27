import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDatabase, ref, push } from "firebase/database";

const AddPlaceScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Coordenadas iniciales por defecto
    longitude: -122.4324,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    // Preguntar si desea usar la ubicación actual
    const askForUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "No se puede acceder a tu ubicación. Selecciona manualmente en el mapa."
          );
          return;
        }

        Alert.alert(
          "Usar mi ubicación",
          "¿Deseas usar tu ubicación actual como punto inicial?",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Sí",
              onPress: async () => {
                const location = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = location.coords;

                // Actualizar el estado para mover el mapa y establecer la ubicación seleccionada
                setRegion({
                  latitude,
                  longitude,
                  latitudeDelta: 0.01, // Más cercano para la vista
                  longitudeDelta: 0.01,
                });
                setSelectedLocation({ latitude, longitude });
              },
            },
          ]
        );
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
        Alert.alert("Error", "No se pudo obtener tu ubicación.");
      }
    };

    askForUserLocation();
  }, []);

  const handleAddPlace = async () => {
    if (!name || !description || !selectedLocation) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const db = getDatabase();
      const placesRef = ref(db, "places");

      await push(placesRef, {
        name,
        description,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });

      Alert.alert("Éxito", "Lugar agregado correctamente.");
      setName("");
      setDescription("");
      setSelectedLocation(null);
    } catch (error) {
      console.error("Error al agregar el lugar:", error);
      Alert.alert("Error", "No se pudo agregar el lugar.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona la Ubicación</Text>

      {/* Mapa interactivo */}
      <MapView
        style={styles.map}
        region={region} // Usar la región controlada
        onPress={(event) => setSelectedLocation(event.nativeEvent.coordinate)}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Ubicación Seleccionada"
          />
        )}
      </MapView>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del lugar"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={description}
          onChangeText={setDescription}
        />
        <Button
          title="Agregar Lugar"
          onPress={handleAddPlace}
          color="#841584"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
  },
  form: {
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default AddPlaceScreen;
