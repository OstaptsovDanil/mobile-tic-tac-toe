import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import GameScreen from './screens/GameScreen';
import WelcomeScreen, { GameMode } from './screens/WelcomeScreen';


export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>();
 

  let currentScreen;
  if (gameMode){
    currentScreen = <GameScreen mode={gameMode} />;
  } else {
    currentScreen =<WelcomeScreen onPressStart={() => setGameMode} />
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
    backgroundColor: 'rgb(4, 73, 68)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
