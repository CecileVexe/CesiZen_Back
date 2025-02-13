import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  BarcodeScanningResult,
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Button, IconButton } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import path from "path";
import { useRouter } from "expo-router";
import { searchBarCode } from "@/services/edamam.services";
import { useRecipes } from "@/context/recipesContext";
const Camera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [recording, setRecording] = useState(false);
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const { addFoodToRecipe, newRecipe } = useRecipes();
  const [isScanning, setIsScanning] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (permission && !permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const scanBarCode = async (data: string) => {
    const food = await searchBarCode(data);

    if (food !== undefined) {
      router.push("/add");
      addFoodToRecipe(food.hints[0].food);
    }
  };

  //   const savePicture = async () => {
  //     console.log("uri", uri);

  //     const filename = path.parse(uri).base;
  //     console.log(filename);

  //     try {
  //       await FileSystem.copyAsync({
  //         from: uri,
  //         to: FileSystem.documentDirectory + filename,
  //       });

  //       router.back();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  const renderCamera = () => {
    return (
      <CameraView
        ref={ref}
        mode={mode}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
        style={{ flex: 1, height: "100%" }}
        onBarcodeScanned={(scanningResult: BarcodeScanningResult) => {
          // Si un scan est déjà en cours, on ignore le nouveau scan
          if (isScanning) return;

          // Marque le scan comme en cours
          setIsScanning(true);

          // Attendre 2 secondes avant de lancer l'action
          setTimeout(() => {
            console.log("Scanned: ", scanningResult);
            scanBarCode(scanningResult.data);

            // Après l'exécution, réinitialise isScanning pour permettre un nouveau scan
            setIsScanning(false);
          }, 2000); // Délai de 2 secondes
        }}
      >
        <View>
          <IconButton icon="camera-flip" onPress={toggleCameraFacing} />
        </View>
      </CameraView>
    );
  };

  return <View style={{ height: "100%" }}>{renderCamera()}</View>;
};

export default Camera;

const styles = StyleSheet.create({});
