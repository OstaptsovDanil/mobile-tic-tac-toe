import React from "react";
import {View, Button} from 'react-native'

interface WelcomeScreenProps {
    onPressStart: () => void;
}

export default function WelcomeScreen({onPressStart}: WelcomeScreenProps){
    return(
    <View>
        <Button title = "start!" onPress={onPressStart} ></Button>
    </View>
    );
}