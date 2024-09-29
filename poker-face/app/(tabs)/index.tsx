import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, Image, Text, View, Button, TouchableOpacity} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React, { useRef, useState, useEffect } from 'react';
import CardView from "@/components/CardView";
import { Camera, CameraType } from 'expo-camera/legacy';
import AntDesign from '@expo/vector-icons/AntDesign';
import ActionDisplay from "@/components/ActionDisplay";

export default function TabTwoScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const [hero, setHero] = useState<number>(123);
  const [pot, setPot] = useState<number>(1322);
  const [potMult, setPotMult] = useState<number>(10);

  const [rounds, setRounds] = useState<string[]>(["Pre-Flop", "Flop", "Turn", "River"]);
  const [roundsIndex, setRoundsIndex] = useState<number>(0);
  const [action, setAction] = useState<string>("raise");
  const [raiseAmount, setRaiseAmount] = useState<number>(10);

  const [recommendation, setRecommendation] = useState<string>("Based on the current situation, with pot odds of 50 and an equity of 25%, you're in a position where a wide range of hands can be played. The recommendation is to raise by 50 to maximize your potential return.");
  const cardData = [
    "2H", "4S",
  ]

  const cardData2 = [
    "5C", "8H", "9S","2H", "4S",
  ]
  useEffect(() => {
    setPotMult(pot/hero);
  }, [hero, pot]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const sendFrame = async (uri: any) => {
    const formData = new FormData();
    const file = {
      uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    };
    formData.append('file', new File([file], 'image.jpg', { type: 'image/jpeg' }));

    try {
      const response = await fetch('http://35.3.49.209:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }
      console.log('Upload successful:', data);
    } catch (error) {
      console.error('Error sending frame:', error);
    }
  };

  const handleCameraStream = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.5,
          base64: true,
          skipProcessing: false, // Skip additional processing for faster capture
        };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log('Captured image:', data.uri);
        setCapturedImage(data.uri); // Display the captured image
        sendFrame(data.uri); // Send the image URI to the backend
        setTimeout(handleCameraStream, 2000); // Repeat after a short delay
      } catch (error) {
        console.error('Error capturing image:', error);
        // Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        handleCameraStream(); // Capture an image every second
      }, 3000);
    }
    return () => clearInterval(interval); // Cleanup on unmount or when isRecording changes
  }, [isRecording]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View className="flex-1 pt-16 px-5" style={styles.background}>
      <View className="flex-row justify-between">
        <View>
          <ThemedText className="text-4xl font-bold text-white">Hero</ThemedText>
          <View className='flex-row items-center'>
            <ThemedText className="text-4xl font-bold text-white">${hero}</ThemedText>
            <View className='flex-row justify-center items-center px-1 py-1 rounded-full bg-gray-700 ml-3'>
              <ThemedText className=" font-bold text-white">{potMult.toFixed(1)}X</ThemedText>
            </View>
          </View>
        </View>
        <View>
          <ThemedText className="text-4xl font-bold text-white text-right">Pot</ThemedText>
          <ThemedText className="text-4xl font-bold text-white">${pot}</ThemedText>
        </View>
      </View>

      <View className="mt-5 ">
        <View className="flex-row justify-between items-center">
          <ThemedText className="text-2xl font-bold text-white">
            Your Hand
          </ThemedText>

          <CardView cardsData={cardData}/>
        </View>

        <View className="flex-row justify-between items-center mt-5">
          <ThemedText className="text-2xl font-bold text-white">
            Table
          </ThemedText>

          <CardView cardsData={cardData2}/>
        </View>
      </View>

      <View className="mt-5 flex-row justify-between items-center">
        <View className='flex-row justify-center items-center px-5 py-1 rounded-full bg-gray-700'>
          <ThemedText className="text-xl font-bold text-white">{rounds[roundsIndex]}</ThemedText>
        </View>

        <ActionDisplay action={action} raise_amount={raiseAmount}/>

        {/*<TouchableOpacity onPress={()=>setRoundsIndex((roundsIndex+1) % rounds.length)}>*/}
        {/*  <View className='flex-row justify-center items-center px-5 py-1 rounded-full bg-gray-700' >*/}
        {/*    <ThemedText className="text-xl font-bold text-white flex justify-between">Next Round  </ThemedText>*/}
        {/*    <AntDesign name="arrowright" size={24} color="white" />*/}
        {/*  </View>*/}
        {/*</TouchableOpacity>*/}
        
      </View>
      {/* <View style={{ flex: 1 }}>
        <Camera ref={cameraRef} style={{ flex: 1 }} type={CameraType.back} />
      </View>
       */}
      {isRecording && (
        <View style={{flex: 1, borderRadius: 25}} className="w-full h-40 rounded-3xl mt-5">
          <Camera ref={cameraRef} style={{ flex: 1 }} type={CameraType.back} />
            {recommendation && (
            <ThemedText className="text-white text-lg mt-5">
              {recommendation}
            </ThemedText>
            )}
        </View>
      )}
      <TouchableOpacity
        onPress={() => setIsRecording(prev => !prev)}
        style={{
          backgroundColor: isRecording ? 'red' : 'green',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <ThemedText className="text-white text-lg">
          {isRecording ? 'Stop Streaming' : 'Start Streaming'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.Black,
    padding: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  headerText: {
    fontSize: 50,
  },

});
