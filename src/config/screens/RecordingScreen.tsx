import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

const RecordingScreen: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const navigation = useNavigation();

  // Opciones de grabación
  const recordingOptions = {
    android: {
        extension: ".m4a",
        outputFormat: 2, // Output format MPEG_4
        audioEncoder: 3, // AAC Encoder
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: ".m4a",
        audioQuality: 127, // High Quality Audio
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: "audio/webm", // Tipo MIME para la web
        bitsPerSecond: 128000,
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 0,
      },
    };
  // Iniciar la grabación
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permiso denegado", "Se requiere acceso al micrófono.");
        return;
      }

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Error al iniciar la grabación:", error);
      Alert.alert("Error", "No se pudo iniciar la grabación.");
    }
  };

  // Detener la grabación
  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Audio guardado localmente en:", uri);

      setRecording(null);
      setIsRecording(false);

      if (uri) {
        await uploadAudioToFirebase(uri);
      }
    } catch (error) {
      console.error("Error al detener la grabación:", error);
      Alert.alert("Error", "No se pudo detener la grabación.");
    }
  };

  // Subir el archivo de audio a Firebase
  const uploadAudioToFirebase = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const userId = "defaultUser";
      const filename = `audio_${Date.now()}.m4a`;
      const storageRef = ref(storage, `audio/${userId}/${filename}`);

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      console.log("Audio subido a Firebase. URL:", downloadUrl);
      Alert.alert("Éxito", "El audio se subió correctamente.");
      navigation.goBack(); // Redirige a Home después de guardar
    } catch (error) {
      console.error("Error al subir el audio.", error);
      Alert.alert("Error", "No se pudo subir el audio.");
    }
  };

  // Cancelar y regresar a HomeScreen
  const cancelRecording = () => {
    if (isRecording && recording) {
      recording.stopAndUnloadAsync().catch((error) => {
        console.error("Error al cancelar la grabación:", error);
      });
    }
    setRecording(null);
    setIsRecording(false);
    navigation.goBack(); // Redirige a Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRecording ? "Grabando..." : "Listo para grabar"}
      </Text>

      {/* Botón de grabar */}
      {!isRecording && (
        <TouchableOpacity
          style={styles.recordButton}
          onPress={startRecording}
        >
          <View style={styles.redDot} />
        </TouchableOpacity>
      )}

      {/* Botón de detener */}
      {isRecording && (
        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopRecording}
        >
          <Text style={styles.stopText}>Detener</Text>
        </TouchableOpacity>
      )}

      {/* Botón de cancelar */}
      <TouchableOpacity style={styles.cancelButton} onPress={cancelRecording}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  redDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF4136",
  },
  stopButton: {
    width: 100,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FF4136",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  stopText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    width: 100,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#808080",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  cancelText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default RecordingScreen;
