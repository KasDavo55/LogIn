import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";


const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.navigate("Login" as never);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Subir imagen desde la galería
  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      uploadImage(uri);
    } else {
      Alert.alert("Operación cancelada", "No se seleccionó ninguna imagen.");
    }
  };

  // Abrir la cámara y tomar una foto
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permiso denegado",
        "Se requiere acceso a la cámara para tomar fotos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      uploadImage(uri);
    } else {
      Alert.alert("Operación cancelada", "No se tomó ninguna foto.");
    }
  };

  // Subir imagen a Firebase Storage
  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = auth.currentUser?.uid || "defaultUser";
      const filename = `${Date.now()}.jpg`;
      const storageRef = ref(storage, `images/${userId}/${filename}`);

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      Alert.alert("Éxito", "Imagen subida correctamente");
      console.log("URL de la imagen:", downloadUrl);
    } catch (error: any) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error", "No se pudo subir la imagen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 300, height: 300, marginBottom: 20 }}
        />
      )}
      {audioUri && <Text style={{ marginBottom: 20 }}>Audio grabado y subido</Text>}

      <Button title="Subir Imagen de Galería" onPress={openGallery} color="#841584" />
      <View style={{ marginVertical: 10 }} />
      <Button title="Abrir Cámara" onPress={openCamera} color="#FF6347" />
      <View style={{ marginVertical: 10 }} />
      <Button title="Ir a Grabar Audio" onPress={() => navigation.navigate("RecordingScreen" as never)} color="#FF4136" />
      <View style={{ marginVertical: 10 }} />
      <Button title="Lugares" onPress={() => navigation.navigate("PlacesScreen" as never)} color="#841584" />
      <View style={{ marginVertical: 10 }} />
      <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default HomeScreen;
