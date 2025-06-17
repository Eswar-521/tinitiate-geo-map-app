import Voice from '@react-native-voice/voice';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VoiceSearchProps {
  onVoiceResult: (text: string) => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onVoiceResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const text = e.value?.[0] || '';
      setResult(text);
      onVoiceResult(text);
      stopRecording();
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      await Voice.start('en-IN');
    } catch (e) {
      console.error('Voice start error:', e);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await Voice.stop();
    } catch (e) {
      console.error('Voice stop error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.button, isRecording && styles.recording]}
      >
        <Text style={styles.buttonText}>{isRecording ? '🛑 Stop' : '🎤 Speak'}</Text>
      </TouchableOpacity>
      {result ? <Text style={styles.result}>You said: {result}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 10 },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  recording: {
    backgroundColor: '#e74c3c',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  result: { marginTop: 10, fontSize: 16, color: '#333' },
});

export default VoiceSearch;
