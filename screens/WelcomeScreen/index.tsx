import React from "react";
import {View, Button} from 'react-native'

export type GameMode = 'pvplocal' | 'pvponline' | 'pvc';

interface WelcomeScreenProps {
    onPressStart: (mode: GameMode) => void;
}

export default function WelcomeScreen({onPressStart}: WelcomeScreenProps){
    return(
    <View style = {{flex: 1}}>
        <Button title = "Play with Friends!" onPress={() => onPressStart('pvplocal')}></Button>
        <Button title="Play With Computer!" onPress={() => onPressStart('pvc')}></Button>
        <Button disabled title="Play Online!" onPress={() => onPressStart('pvponline')}></Button>
    </View>
    );
}