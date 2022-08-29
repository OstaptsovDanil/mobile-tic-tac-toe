import React from 'react';
import { View, Button } from 'react-native';

export type GameMode = 'pvplocal' | 'pvponline' | 'pvc';

interface WelcomeScreenProps {
  onPressStart: (mode: GameMode) => void;
}

export default function WelcomeScreen({ onPressStart }: WelcomeScreenProps) {
  return (
    <View>
      <Button title="Play With a Friend!" onPress={() => onPressStart('pvplocal')} />
      <Button title="Play With Computer!" onPress={() => onPressStart('pvc')} />
      <Button title="Play Online!" onPress={() => onPressStart('pvponline')} />
    </View>
  );
}