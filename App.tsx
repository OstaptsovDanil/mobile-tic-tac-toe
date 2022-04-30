import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import GameScreen from './screens/GameScreen';
import WelcomeScreen from './screens/WelcomeScreen';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  let currentScreen;
  if (gameStarted){
    currentScreen = <GameScreen />;
  } else {
    currentScreen = <WelcomeScreen onPressStart={() => setGameStarted(true)} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen}
    </SafeAreaView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
