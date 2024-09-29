import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function ChatTutorScreen() {
  const [messages, setMessages] = useState([]); // For chat messages
  const [inputText, setInputText] = useState('');
  const [eventBuffer, setEventBuffer] = useState(''); // For buffering incomplete SSE messages
  const [nextValue, setNextValue] = useState(null); // For storing $next value
  const scrollViewRef = useRef();

  const handleParsedData = (jsonData) => {
    if (Array.isArray(jsonData)) {
      const type = jsonData[0];
      if (type === 'output') {
        // Process output data
        const outputNode = jsonData[1].outputs.output;
        outputNode.forEach((output) => {
          // Check if the role is 'model' before adding to messages
          if (output.role === 'model') {
            output.parts.forEach((part) => {
              // Only add to messages if it doesn't contain the unwanted text
              if (part.text && !part.text.includes("Understood") && !part.text.includes("I will provide") && !part.text.includes("I will give") && !part.text.includes("I will offer")) {
                setMessages((prevMessages) => {
                  // Check if the message is already in the list
                  const messageExists = prevMessages.some(msg => msg.type === 'ai' && msg.text === part.text);
                  if (!messageExists) {
                    // If the message doesn't exist, append it to the messages list
                    return [...prevMessages, { type: 'ai', text: part.text }];
                  }
                  // Otherwise, return the previous messages unchanged
                  return prevMessages;
                });
              }
            });
          }
        });
      } else if (type === 'input') {
        // Process input data
        console.log('Processing input data:', jsonData[1]);
  
        // Extract $next value
        const nextValueFromEvent = jsonData[2]; // $next value is the third element
        if (nextValueFromEvent) {
          setNextValue(nextValueFromEvent);
          console.log('Set $next value:', nextValueFromEvent);
        }
      }
    }
  };

  const parseSSEData = (data) => {
    try {
      const combinedData = eventBuffer + data;

      // Split the data into events
      const events = combinedData.split('\n\n');

      // Save the last incomplete event back to the buffer
      const incompleteEvent = events.pop();
      setEventBuffer(incompleteEvent);

      events.forEach((event) => {
        if (event.startsWith('data:')) {
          // Remove 'data:' prefix
          const dataString = event.substring(5).trim();
          const jsonData = JSON.parse(dataString);
          console.log('Parsed data:', jsonData);

          // Handle the parsed data
          handleParsedData(jsonData);
        }
      });
    } catch (error) {
      console.error('Error parsing SSE data:', error);
    }
  };

  const postDataToBreadboard = () => {
    const url = 'https://breadboard-community.wl.r.appspot.com/boards/@AdorableElephant/lady-gaga.bgl.api/run';

    // Build the request body
    const requestBody = {
      "$key": "bb-rr3g29r532n1i2d5g4r3e2i4o4c3v2b6a5mga4x4j2y2o6p6is",
      "text": {
        "role": "user",
        "parts": [{ "text": inputText }],
      },
    };

    // Include $next if we have it
    if (nextValue) {
      requestBody["$next"] = nextValue;
    } else {
      // If no $next, include initial context
      requestBody["context"] = [
        {
          "role": "user",
          "parts": [{ "text": inputText }],
        },
      ];
    }

    // Add the user's message to the messages state
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: inputText }]);

    // Clear the inputText
    setInputText('');

    // Create an XMLHttpRequest
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);

    xhr.setRequestHeader('Content-Type', 'application/json');

    let receivedLength = 0;

    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.LOADING || xhr.readyState === xhr.DONE) {
        const newData = xhr.responseText.substring(receivedLength);
        receivedLength = xhr.responseText.length;

        // Process newData
        parseSSEData(newData);
      }

      if (xhr.readyState === xhr.DONE) {
        console.log('Request completed');
      }
    };

    xhr.onerror = (error) => {
      console.error('XHR error:', error);
    };

    xhr.send(JSON.stringify(requestBody));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Talk to Lady Gaga</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {messages.map((message, index) => (
          <View key={index} style={message.type === 'user' ? styles.userMessage : styles.aiMessage}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask a question..."
          placeholderTextColor="#B0BEC5"
        />
        <TouchableOpacity style={styles.sendButton} onPress={postDataToBreadboard}>
          <FontAwesome name="paper-plane" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <TouchableOpacity
          style={styles.suggestionButton}
          onPress={() => setInputText('What should I do with this hand?')}
        >
          <Text style={styles.suggestionText}>What should I do with this hand?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.suggestionButton}
          onPress={() => setInputText('Explain my last game?')}
        >
          <Text style={styles.suggestionText}>Explain my last game?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestionButton} onPress={() => setInputText('How can I improve?')}>
          <Text style={styles.suggestionText}>How can I improve?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Keep your styles as they are)
  container: {
    flex: 1,
    backgroundColor: Colors.Black,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingTop: 40
  },
  backButton: {
    padding: 10,
  },
  chatContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#388E3C',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.Grey,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#3B3B3B',
    borderRadius: 5,
    padding: 10,
    color: '#FFFFFF',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#388E3C',
    borderRadius: 5,
    padding: 10,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  suggestionButton: {
    backgroundColor: '#3B3B3B',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  suggestionText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});