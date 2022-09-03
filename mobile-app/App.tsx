import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import GameScreen from './screens/GameScreen';
import WelcomeScreen, { GameMode } from './screens/WelcomeScreen';
import { QueryClient, QueryClientProvider } from 'react-query';

import { NETWORK_GAME_QUERY_CACHE_KEY } from './screens/GameScreen/players/onNetworkPlayer';
const queryClient = new QueryClient();

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>();
 

  let currentScreen;
  if (gameMode){
    queryClient.invalidateQueries(NETWORK_GAME_QUERY_CACHE_KEY);
    currentScreen = <GameScreen mode={gameMode} />;
  } else {
    currentScreen =<WelcomeScreen onPressStart={setGameMode} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {currentScreen}
      </SafeAreaView>
    </QueryClientProvider>
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
