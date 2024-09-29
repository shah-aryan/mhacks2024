import {ThemedText} from "@/components/ThemedText";
import {View} from "react-native";

type ActionDisplayProps = {
  action: string;
  raise_amount: number;
  is_preflop: boolean;
}

export default function ActionDisplay(props: ActionDisplayProps){
  const { action, raise_amount, is_preflop } = props;
  if(action === "fold"){
    return (
      <View className='flex-row justify-center items-center px-2 py-1 rounded-full bg-[#FF4848]' >
        <ThemedText className="text-xl font-bold text-white">Fold</ThemedText>
      </View>
    )
  } else if(action === "call"){
    return (
      <View className='flex-row justify-center items-center px-2 py-1 rounded-full bg-[#EFAC01]' >
        <ThemedText className="text-xl font-bold text-white" >Call</ThemedText>
      </View>
    )
  } else if(action === "raise"){
    return (
      <View className='flex-row justify-center items-center px-2 py-1 rounded-full bg-[#008B38]' >
        <ThemedText className="text-xl font-bold text-white">Raise {!is_preflop &&  "$" + raise_amount }</ThemedText>
      </View>
    )
  }
}