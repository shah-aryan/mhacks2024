import React, { useRef, useState, useEffect } from 'react';
import { Image, StyleSheet, Platform, View, Button, Text, Modal, TextInput } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Camera, CameraType } from 'expo-camera';
import {Colors} from '@/constants/Colors';

export default function PotOdds() {
  // const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  interface Decision {
    player: string;
    action: string;
    amount: string;
    timestamp: string;
  }
  
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDecision, setNewDecision] = useState({ player: '', action: '', amount: '' });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const addDecision = () => {
    setDecisions([...decisions, { ...newDecision, timestamp: new Date().toLocaleTimeString() }]);
    setNewDecision({ player: '', action: '', amount: '' });
    setModalVisible(false);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: Colors.inactiveColor}}
      headerImage={
      <View style={styles.headerImageContainer}>
        <Image
        source={require('@/assets/images/images.png')}
        style={styles.reactLogo}
        />
      </View>
      }
    >
      <ThemedView style={styles.titleContainer}>
      </ThemedView>

      {/* Poker Decisions UI */}
      <ThemedView style={styles.decisionsContainer}>
        <Text style={styles.headerText}>Poker Game Decisions</Text>
        <Button title="Add Decision" onPress={() => setModalVisible(true)} />
        {decisions.map((decision, index) => (
          <View key={index} style={styles.decisionRow}>
            <Text style={styles.text}>{decision.player}</Text>
            <Text style={styles.text}>{decision.action}</Text>
            <Text style={styles.text}>{decision.amount}</Text>
            <Text style={styles.text}>{decision.timestamp}</Text>
          </View>
        ))}
      </ThemedView>

      {/* Modal for Adding Decisions */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <Text style={styles.modalHeader}>Add New Decision</Text>
          <TextInput
            placeholder="Player"
            value={newDecision.player}
            onChangeText={(text) => setNewDecision({ ...newDecision, player: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Action (e.g. Call, Raise, Fold)"
            value={newDecision.action}
            onChangeText={(text) => setNewDecision({ ...newDecision, action: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Amount"
            value={newDecision.amount}
            onChangeText={(text) => setNewDecision({ ...newDecision, amount: text })}
            style={styles.input}
            keyboardType="numeric"
          />
          <Button title="Add" onPress={addDecision} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center', // Center the content horizontally
  },
  decisionsContainer: {
    backgroundColor: '#1D3D47', // Dark background
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  decisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Light text for dark background
    marginBottom: 10,
  },
  text: {
    color: '#fff', // Light text color
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#1D3D47', // Dark background for modal
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Light text color
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    width: '80%',
    backgroundColor: '#fff', // Light background for input fields
    borderRadius: 5,
  },
  reactLogo: {
    height: 200, // Smaller height
    width: 200, // Smaller width
  },
});