import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import CardView from '@/components/CardView'; // Import the CardView component

// Sample data for gameplay history with multiple hands and rounds in a session
const gameplayHistory = [
  {
    date: '2024-09-25',
    buyIn: 100,
    profit: 50,
    loss: 0,
    netVsExpected: '1.2X',
    performanceRating: 4,
    summary: 'Played aggressively, capitalized on opponents’ mistakes.',
    rounds: [
      {
        playerHand: ['AH', 'KH'],
        flop: ['2D', '4H', '9C'],
        turn: ['7S'],
        river: ['JC'],
      },
      {
        playerHand: ['10D', 'JC'],
        flop: ['3H', '5C', '8D'],
        turn: ['KH'],
        river: ['4S'],
      },
    ],
  },
  {
    date: '2024-09-20',
    buyIn: 50,
    profit: 0,
    loss: 50,
    netVsExpected: '0.8X',
    performanceRating: 1,
    summary: 'Underestimated opponents, missed key opportunities.',
    rounds: [
      {
        playerHand: ['7C', '8D'],
        flop: ['3H', '4C', '5D'],
        turn: ['6S'],
        river: ['KD'],
      },
    ],
  },
  {
    date: '2024-09-15',
    buyIn: 200,
    profit: 100,
    loss: 0,
    netVsExpected: '1.5X',
    performanceRating: 5,
    summary: 'Excellent reads on opponents, high risk rewarded.',
    rounds: [
      {
        playerHand: ['9S', '10S'],
        flop: ['AS', '2C', '3D'],
        turn: ['QH'],
        river: ['JS'],
      },
      {
        playerHand: ['AS', '2C'],
        flop: ['4D', '5H', '6S'],
        turn: ['7C'],
        river: ['8D'],
      },
    ],
  },
];

export default function PokerMetricsScreen() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [showHandDetails, setShowHandDetails] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false); 
  const [selectedHand, setSelectedHand] = useState(null); // For showing specific round details

  const getPerformanceGradient = (rating: number): string[] => {
    if (rating >= 4) {
      return ['#4CAF50', '#2E7D32']; // Darker green shades for high performance
    } else if (rating >= 2) {
      return ['#FBC02D', '#F57F17']; // Darker yellow shades for average performance
    } else {
      return ['#E57373', '#C62828']; // Darker red shades for low performance
    }
  };
  

  const handleViewHandDetails = (round: any) => {
    setSelectedHand(round);
    setShowHandDetails(true);
  };

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Gameplay History</ThemedText>
        {/* <TouchableOpacity onPress={() => setShowMetrics(!showMetrics)}>
          <Ionicons name={showMetrics ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity> */}
      </View>

      {showMetrics && (
        <View style={styles.metricsContainer}>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Total Hands Played:</ThemedText>
            <ThemedText style={styles.metricValue}>{150}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Hands Won:</ThemedText>
            <ThemedText style={styles.metricValue}>{75}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Win Rate:</ThemedText>
            <ThemedText style={styles.metricValue}>50%</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Total Profit:</ThemedText>
            <ThemedText style={styles.metricValue}>${1200}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Average Bet:</ThemedText>
            <ThemedText style={styles.metricValue}>${50}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Favorite Hand:</ThemedText>
            <ThemedText style={styles.metricValue}>AA</ThemedText>
          </ThemedView>
        </View>
      )}

      {/* Gameplay History Section */}
      {/* <Text style={styles.historyTitle}>Gameplay History</Text> */}
      <Text style={styles.historyTitle}>Gameplay History</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {gameplayHistory.map((game, index) => (
          <LinearGradient 
            key={index} 
            colors={getPerformanceGradient(game.performanceRating)} // Use the color function
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{game.date}</Text>
            <Text style={styles.cardText}>Buy In: ${game.buyIn}</Text>
            <Text style={styles.cardText}>Profit: ${game.profit}</Text>
            <Text style={styles.cardText}>Loss: ${game.loss}</Text>
            <Text style={styles.cardText}>Net vs Expected: {game.netVsExpected}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={24} color="#FFD700" style={styles.ratingIcon} />
              <Text style={styles.ratingText}>{game.performanceRating}</Text>
            </View>
            <Text style={styles.cardText}>Summary: {game.summary}</Text>
            {game.rounds.map((round, roundIndex) => (
              <TouchableOpacity 
                key={roundIndex}
                style={styles.cardButton} 
                onPress={() => handleViewHandDetails(round)}
              >
                <ThemedText style={styles.cardButtonText}>View Round {roundIndex + 1}</ThemedText>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        ))}
      </ScrollView>

      
      <TouchableOpacity style={styles.button} onPress={() => setShowRecommendations(true)}>
        <ThemedText style={styles.buttonText}>Get General Trend Recommendations</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to Hand History')}>
        <ThemedText style={styles.buttonText}>View Detailed Hand History</ThemedText>
      </TouchableOpacity>

      <Modal visible={showHandDetails} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>Hand Details</ThemedText>
            {selectedHand && (
              <>
                <ThemedText style={styles.modalHandTitle}>Player Hand:</ThemedText>
                <CardView cardsData={selectedHand.playerHand} />
                <ThemedText style={styles.modalHandTitle}>Flop:</ThemedText>
                <CardView cardsData={selectedHand.flop} />
                <ThemedText style={styles.modalHandTitle}>Turn:</ThemedText>
                <CardView cardsData={selectedHand.turn} />
                <ThemedText style={styles.modalHandTitle}>River:</ThemedText>
                <CardView cardsData={selectedHand.river} />
              </>
            )}
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowHandDetails(false)}
            >
              <ThemedText style={styles.buttonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recommendations Modal */}
      <Modal visible={showRecommendations} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ThemedText style={styles.modalTitle}>General Trend Recommendations</ThemedText>
            <ThemedText style={styles.modalText}>1. Don't overestimate draws when a lot of money is at stake. Folding in the 9/20 game, where you had an open-ended straight draw, is often the correct play when a large bet is in front of you. Beginners chase draws too often.</ThemedText>
            <ThemedText style={styles.modalText}>2. Be wary of overplaying top pair. While top pair is a decent hand, it is vulnerable. Analyze the board texture and your opponent's betting pattern ebfore committing too many chips with top pair.</ThemedText>
            <ThemedText style={styles.modalText}>3. Understand position is powerful. Acting last gives you more information to base your decisions on. Try to play more hands when you are in late position.</ThemedText>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setShowRecommendations(false)}
            >
              <ThemedText style={styles.buttonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: Colors.Black,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 40,
    marginTop: 70,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 10,
  },
  metricsContainer: {
    backgroundColor: '#1D3D47',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  metricTitle: {
    color: '#E0E0E0',
    fontSize: 18,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#2D3E50',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 250,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  cardText: {
    color: '#FFFFFF',
    marginTop: 5,
  },
  cardButton: {
    backgroundColor: '#3B3B3B',
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3B3B3B',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Half-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.Black,
    borderRadius: 10,
    padding: 20,
    width: '80%', // Width of the modal
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 15,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginVertical: 5,
  },
  modalButton: {
    backgroundColor: '#3B3B3B',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  handContainer: {
    marginTop: 15,
    marginBottom: 15,
    maxHeight: '50%', // Limit height of hand history display
    width: '100%', // Make sure it occupies full width
  },
  modalHandTitle: {
    color: '#E0E0E0',
    fontSize: 18,
    marginVertical: 5,
  },
});