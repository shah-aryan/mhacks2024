import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';

export default function PokerMetricsScreen() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [metrics, setMetrics] = useState({
    totalHands: 150,
    handsWon: 75,
    winRate: '50%',
    totalProfit: 1200,
    averageBet: 50,
    favoriteHand: 'AA',
  });

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Poker Metrics</ThemedText>
        <TouchableOpacity onPress={() => setShowMetrics(!showMetrics)}>
          <Ionicons name={showMetrics ? "chevron-up" : "chevron-down"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showMetrics && (
        <View style={styles.metricsContainer}>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Total Hands Played:</ThemedText>
            <ThemedText style={styles.metricValue}>{metrics.totalHands}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Hands Won:</ThemedText>
            <ThemedText style={styles.metricValue}>{metrics.handsWon}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Win Rate:</ThemedText>
            <ThemedText style={styles.metricValue}>{metrics.winRate}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Total Profit:</ThemedText>
            <ThemedText style={styles.metricValue}>${metrics.totalProfit}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Average Bet:</ThemedText>
            <ThemedText style={styles.metricValue}>${metrics.averageBet}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.metric}>
            <ThemedText style={styles.metricTitle}>Favorite Hand:</ThemedText>
            <ThemedText style={styles.metricValue}>{metrics.favoriteHand}</ThemedText>
          </ThemedView>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to Hand History')}>
        <ThemedText style={styles.buttonText}>View Hand History</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => console.log('Show Recommendations')}>
        <ThemedText style={styles.buttonText}>Get Playing Recommendations</ThemedText>
      </TouchableOpacity>
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
    marginVertical: 40, // Increased margin to move header down
    marginTop: 50, // Added marginTop to create space above
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
});