import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, Image, Platform, View, Button, TouchableOpacity} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import {useEffect, useState} from "react";
import CardView from "@/components/CardView";
import AntDesign from '@expo/vector-icons/AntDesign';
import ActionDisplay from "@/components/ActionDisplay";

export default function TabTwoScreen() {
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

      <View className="w-full h-40 bg-gray-400 rounded-3xl mt-5">
        <ThemedText>Placeholder</ThemedText>
      </View>

      <View>
        <ThemedText className="text-white text-lg">{recommendation}</ThemedText>
      </View>
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
