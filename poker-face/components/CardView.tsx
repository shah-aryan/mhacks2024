import {Image, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import Card from "../assets/cards/2 clubs.png";

type CardsProps = {
  cardsData: string[];
}

export default function CardView(props: CardsProps) {

  const { cardsData } = props;

  // Manually import all the card images
  const cardImages = {
    // Spades
    'AS': require('../assets/cards/A_spades.png'),
    '2S': require('../assets/cards/2_spades.png'),
    '3S': require('../assets/cards/3_spades.png'),
    '4S': require('../assets/cards/4_spades.png'),
    '5S': require('../assets/cards/5_spades.png'),
    '6S': require('../assets/cards/6_spades.png'),
    '7S': require('../assets/cards/7_spades.png'),
    '8S': require('../assets/cards/8_spades.png'),
    '9S': require('../assets/cards/9_spades.png'),
    '10S': require('../assets/cards/10_spades.png'),
    'JS': require('../assets/cards/J_spades.png'),
    'QS': require('../assets/cards/Q_spades.png'),
    'KS': require('../assets/cards/K_spades.png'),

    // Hearts
    'AH': require('../assets/cards/A_hearts.png'),
    '2H': require('../assets/cards/2_hearts.png'),
    '3H': require('../assets/cards/3_hearts.png'),
    '4H': require('../assets/cards/4_hearts.png'),
    '5H': require('../assets/cards/5_hearts.png'),
    '6H': require('../assets/cards/6_hearts.png'),
    '7H': require('../assets/cards/7_hearts.png'),
    '8H': require('../assets/cards/8_hearts.png'),
    '9H': require('../assets/cards/9_hearts.png'),
    '10H': require('../assets/cards/10_hearts.png'),
    'JH': require('../assets/cards/J_hearts.png'),
    'QH': require('../assets/cards/Q_hearts.png'),
    'KH': require('../assets/cards/K_hearts.png'),

    // Diamonds
    'AD': require('../assets/cards/A_diamonds.png'),
    '2D': require('../assets/cards/2_diamonds.png'),
    '3D': require('../assets/cards/3_diamonds.png'),
    '4D': require('../assets/cards/4_diamonds.png'),
    '5D': require('../assets/cards/5_diamonds.png'),
    '6D': require('../assets/cards/6_diamonds.png'),
    '7D': require('../assets/cards/7_diamonds.png'),
    '8D': require('../assets/cards/8_diamonds.png'),
    '9D': require('../assets/cards/9_diamonds.png'),
    '10D': require('../assets/cards/10_diamonds.png'),
    'JD': require('../assets/cards/J_diamonds.png'),
    'QD': require('../assets/cards/Q_diamonds.png'),
    'KD': require('../assets/cards/K_diamonds.png'),

    // Clubs
    'AC': require('../assets/cards/A_clubs.png'),
    '2C': require('../assets/cards/2_clubs.png'),
    '3C': require('../assets/cards/3_clubs.png'),
    '4C': require('../assets/cards/4_clubs.png'),
    '5C': require('../assets/cards/5_clubs.png'),
    '6C': require('../assets/cards/6_clubs.png'),
    '7C': require('../assets/cards/7_clubs.png'),
    '8C': require('../assets/cards/8_clubs.png'),
    '9C': require('../assets/cards/9_clubs.png'),
    '10C': require('../assets/cards/10_clubs.png'),
    'JC': require('../assets/cards/J_clubs.png'),
    'QC': require('../assets/cards/Q_clubs.png'),
    'KC': require('../assets/cards/K_clubs.png'),
  };


  const importAllCards = (): { [key: string]: any } => {
    let images: { [key: string]: any } = {};

    Object.keys(cardImages).forEach((cardKey) => {
      // @ts-ignore
      images[cardKey] = cardImages[cardKey];
    });

    return images;
  };

  const cards = importAllCards();

  return(
    <View className="flex-row items-center">
      {cardsData.map((card: any, index: number) => (
        <Image source={cards[card]} key={index} className="w-[50px] h-[70px] mr-1"/>
      ))}
    </View>
  );
}