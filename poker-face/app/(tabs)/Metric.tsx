import React, { useRef, useState, useEffect } from 'react';
import { View, Button, Text, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera/legacy';

const CameraStream = () => {
  const cameraRef = useRef<Camera | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  

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
      }, 1000);
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Camera ref={cameraRef} style={{ flex: 1 }} type={CameraType.back} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          title={isRecording ? 'Stop Streaming' : 'Start Streaming'}
          onPress={() => setIsRecording(prev => !prev)}
        />
        {capturedImage && ( // Conditionally render the Image component
          <Image
            source={{ uri: capturedImage }}
            style={{ width: 200, height: 200 }} // Adjust size as needed
          />
        )}
      </View>
    </View>
  );
};

export default CameraStream;