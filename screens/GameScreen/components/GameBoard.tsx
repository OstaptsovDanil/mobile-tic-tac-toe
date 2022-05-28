import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import {Cell, State} from '../../../game/Engine';
import {useFonts, CabinSketch_400Regular} from '@expo-google-fonts/cabin-sketch';

interface GameBoardProps{
    state: State;
    onCellPress: (x: number, y: number) => void;
};

interface GameCellProps {
    value: Cell;
    onPress: () => void;
};

const cellValueToChar = {
    [Cell.Empty]: '',
    [Cell.X]: 'X',
    [Cell.O]: 'O',
};

const cellValueToColor = {
    [Cell.Empty]: 'black',
    [Cell.X]: 'white',
    [Cell.O]: 'white',
};

function GameCell({value, onPress}: GameCellProps){
    return(
        <Pressable onPress={onPress}>
            <Text style={[styles.cell, {color: cellValueToColor[value]}]}>
                {cellValueToChar[value]}
            </Text>
        </Pressable>
    );
}

export default function GameBoard({ state, onCellPress }: GameBoardProps){
    const [fontsLoaded] = useFonts({
        CabinSketch_400Regular,
      });
    
      if (!fontsLoaded) {
        return(
            <View>
                <Text>Шрифт не загрузился</Text>
            </View>
        )
      }
    return (
        <View>
            <View style={styles.row}>
                <GameCell value={state[0][0]} onPress={() => onCellPress(0, 0)}/>
                <GameCell value={state[0][1]} onPress={() => onCellPress(0, 1)}/>
                <GameCell value={state[0][2]} onPress={() => onCellPress(0, 2)}/>
            </View>

            <View style={styles.row}>
                <GameCell value={state[1][0]} onPress={() => onCellPress(1, 0)}/>
                <GameCell value={state[1][1]} onPress={() => onCellPress(1, 1)}/>
                <GameCell value={state[1][2]} onPress={() => onCellPress(1, 2)}/>
            </View>

            <View style={styles.row}>
                <GameCell value={state[2][0]} onPress={() => onCellPress(2, 0)}/>
                <GameCell value={state[2][1]} onPress={() => onCellPress(2, 1)}/>
                <GameCell value={state[2][2]} onPress={() => onCellPress(2, 2)}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 80,
        height: 80,
        fontSize: 70,
        lineHeight: 84,
        borderWidth: 3,
        borderColor: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'CabinSketch_400Regular'
    },
});