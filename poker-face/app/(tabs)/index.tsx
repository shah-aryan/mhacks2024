import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, Image, Text, View, Button, TouchableOpacity, ScrollView, Dimensions} from 'react-native';

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
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabTwoScreen() {
  const cameraRef = useRef<Camera | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  const [hero, setHero] = useState<number>(100);
  const [pot, setPot] = useState<number>(1000);
  const [potMult, setPotMult] = useState<number>(10);

  const [rounds, setRounds] = useState<string[]>(["Preflop", "Flop", "Turn", "River"]);
  const [roundsIndex, setRoundsIndex] = useState<number>(0);
  const [action, setAction] = useState<string>("raise");
  const [raiseAmount, setRaiseAmount] = useState<number>(10);

  const [recommendation, setRecommendation] = useState<string>("Based on the current situation, with pot odds of 50 and an equity of 25%, you're in a position where a wide range of hands can be played. The recommendation is to raise by 50 to maximize your potential return.");

  const [betThreshold, setBetThreshold] = useState<number[]>([5,10,3]);

  const [potentialDraws, setPotentialDraws] = useState<any>(null);

  const [cardData, setCardData] = useState([
    "2H", "4S",
  ])

  const [tableData, setTableData] = useState([
    "5C", "8H", "9S","2H", "4S",
  ])

  const [EV, setEV] = useState<number>(0.35)
  const [equity, setEquity] = useState<number>(0.70)
  const [potOdds, setPotOdds] = useState<number>(0.56)

  const [isCamMode, setIsCamMode] = useState<boolean>(false);
  
  useEffect(() => {
    setPotMult(pot/hero);
  }, [hero, pot]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    setPotentialDraws([{draw: "Flush", probability: 35}, {draw: "Straight", probability: 10}])
  }, []);

  const sendPredictionRequest = async () => {


    try {
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to predict');
        }

        const result = await response.json();
        console.log('Prediction result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
};


const sendFrame = async (data: any) => {
  const file = {
    image: data, // e.g. base64 encoded image string
    game_stage: rounds[roundsIndex].toLowerCase(),   // e.g. "preflop", "flop", "turn", "river"
  };

  try {
    const response = await fetch('http://35.3.113.147:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Specify JSON content type
      },
      body: JSON.stringify(file),
    });
    
    const data = await response.text();
    if (!response.ok) {
      throw new Error(JSON.stringify(data) || 'File upload failed');
    }
    
    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Error sending frame:', error);
  }
};


  const handleCameraStream = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.7,
          base64: true,
          skipProcessing: false, // Skip additional processing for faster capture
          pictureSize: '1920x1080',
        };
        const data = await cameraRef.current.takePictureAsync(options);
        console.log('Captured image:', data.uri);
        setCapturedImage(data.uri); // Display the captured image
        const response:any = await sendFrame(data.base64);
        setHero(response?.user_value)
        setPot(response?.pot_value)
        setCardData(response?.user_card_data )
        setTableData(response?.table_card_data)
        setBetThreshold(response?.bet_threshold )
        setEV(response?.ev || EV)
        setEquity(response?.equity || equity)
        
        console.log(response)
        
        setTimeout(handleCameraStream, 10000); // Repeat after a short delay
      } catch (error) {
        console.error('Error capturing image:', error);
        //Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        handleCameraStream(); // Capture an image every second
      }, 10000);
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
    isCamMode ? (
      <View className="flex-1 pt-16 pb-5" style={styles.background}>
        <Camera ref={cameraRef} style={{ flex: 1}} type={CameraType.back} />
        <TouchableOpacity className="flex justify-center bg-gray-700 rounded-full p-3 mt-3" onPress={() => setIsCamMode(!isCamMode)}>
          <ThemedText className="text-xl font-bold text-white">Return to Dashboard</ThemedText>
        </TouchableOpacity>
      </View>

      ) : (
    <View className="flex-1 pt-16 px-5" style={styles.background}>
      <View className="flex-row justify-between items-center">
        <ThemedText className="text-4xl font-bold text-white w-1/3">Hero</ThemedText>
        <View className='flex-row justify-center items-center px-3 h-10 rounded-full bg-gray-700 w-1/3'>
          <ThemedText className="text-xl font-bold text-white">{rounds[roundsIndex]}</ThemedText>
        </View>
        <ThemedText className="text-4xl font-bold text-white text-right w-1/3">Pot</ThemedText>
      </View>

      <View className="flex-row justify-between items-center mt-2">
          <ThemedText className="text-4xl font-bold text-white">${hero}</ThemedText>
          <View className='flex-row justify-center items-center px-1 py-1 rounded-full bg-gray-700 ml-3'>
            <ThemedText className=" font-bold text-white">{potMult.toFixed(1)}X</ThemedText>
          </View>
        <ThemedText className="text-4xl font-bold text-white">${pot}</ThemedText>
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

          <CardView cardsData={tableData}/>
        </View>
      </View>


        <Text className='text-lg font-bold text-white text-center mt-3'>
          {roundsIndex === 0 ? "EV" : "Bet"} Threshold
        </Text>

      <View className="flex-row justify-between items-center">
        {roundsIndex === 0 ? (<ActionDisplay action={'raise'} raise_amount={raiseAmount} is_preflop={true}/>)
        :
          (<ActionDisplay action={'raise'} raise_amount={betThreshold[2]} is_preflop={false}/>)}
        <Text className="text-2xl font-bold text-white">{roundsIndex === 0 ? '> 0.5' : '< $' + betThreshold[0]}</Text>
        <ActionDisplay action={'call'} raise_amount={raiseAmount} is_preflop={false}/>
        <Text className="text-2xl font-bold text-white">{roundsIndex === 0 ? '> 0' : '< $' + + betThreshold[1]}</Text>
        <ActionDisplay action={'fold'} raise_amount={raiseAmount} is_preflop={false}/>


      </View>
      {isRecording && (
        <View style={{flex: 1, borderRadius: 25}} className="w-full h-full mt-5">
          <Camera ref={cameraRef} style={{ flex: 1}} type={CameraType.back} />
          <TouchableOpacity className="flex justify-center mt-1" onPress={() => setIsCamMode(!isCamMode)}>
            <FontAwesome name="expand" size={24} color="white" />
          </TouchableOpacity>
            {recommendation && (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{flex: 1}}
              >
                <View style={[styles.page]}>
                  {roundsIndex === 0 ? (
                    <View className="flex-row justify-center items-center">
                      <View className="flex-col justify-center items-center p-5 bg-gray-700 rounded-3xl">
                        <ThemedText className="text-xl font-bold text-white">EV</ThemedText>
                        <ThemedText className="text-xl font-bold text-white">{EV}</ThemedText>
                      </View>
                    </View>
                    ) : (
                    <View className="flex-row justify-center items-center">
                      <View className="flex-col justify-center items-center p-5 bg-gray-700 rounded-3xl">
                        <ThemedText className="text-xl font-bold text-white">Equity</ThemedText>
                        <ThemedText className="text-xl font-bold text-white">{equity}</ThemedText>
                      </View>

                      {/* <View className="flex-col justify-center items-center p-5 bg-gray-700 rounded-3xl">
                        <ThemedText className="text-xl font-bold text-white">Pot Odds</ThemedText>
                        <ThemedText className="text-xl font-bold text-white">{potOdds}</ThemedText>
                      </View>

                      <ScrollView
                        vertical
                        pagingEnabled
                        showsVerticalScrollIndicator={true}
                        className="mt-5"
                      >
                        {potentialDraws.map((potentialDraw: any, index: number) => (
                          <View className="flex-row justify-between items-center" key={index}>

                              <ThemedText className='text-white text-lg'>{potentialDraw.draw}</ThemedText>
                              <ThemedText className='text-white text-lg'>{potentialDraw.probability}%</ThemedText>

                          </View>
                        ))}
                      </ScrollView> */}
                    </View>
                  )}

                </View>
                <View style={[styles.page]}>
                  <ThemedText className='text-white text-lg'>{recommendation}</ThemedText>
                </View>
              </ScrollView>
            )}


        </View>
      )}
      {isRecording ? (
        <View className="flex-row justify-between mt-5">
          <TouchableOpacity
            onPress={() => setIsRecording(prev => !prev)}
            className="bg-[#FF4848] rounded-3xl"
          >
            <ThemedText className="text-white text-lg font-bold py-2 px-3">
              <Feather name="pause-circle" size={24} color="white" />
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>setRoundsIndex((roundsIndex+1) % rounds.length)}>
            <View className='flex-row justify-center items-center px-5 py-2 rounded-full bg-gray-700' >
              <ThemedText className="text-xl font-bold text-white flex justify-between">Next Round  </ThemedText>
              <AntDesign name="arrowright" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setIsRecording(prev => !prev)}
          style={{
            backgroundColor:Colors.Green,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <ThemedText className="text-white text-lg font-bold">
            {isRecording ? 'Stop Streaming' : 'Start Streaming'}
          </ThemedText>
        </TouchableOpacity>
      )}

    </View>)
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
  page: {
    width: Dimensions.get('window').width - 40,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
