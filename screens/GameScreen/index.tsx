import React, {useEffect, useState} from "react";
import { View, Text } from 'react-native';
import Engine, {Cell, MakeMoveFn, OnMoveFn, State } from "../../game/Engine";
import GameBoard from "./components/GameBoard";
import { GameMode } from '../WelcomeScreen';

function getEndgameText(winner: Cell): string {
    if(winner === Cell.Empty){
        return 'It\'s a draw!'
    } else{
        return `${winner === Cell.X ? Cell.X : Cell.O} wins!`
    }
}

interface GameScreenProps {
    mode: GameMode;
}

export default function GameScreen ({mode}: GameScreenProps) {
    const [currentPlayerMakeMove, setCurrentPlayerMakeMove] = useState<MakeMoveFn>();
    const [currentPlayer, setCurrentPlayer] = useState<Cell.X | Cell.O>();
    const [currentState, setCurrentState] = useState<State>();
    const [winner, setWinner] = useState<Cell>();

    const onPlayerMove: OnMoveFn = (state, whoAmI, makeMove) => {
        setCurrentPlayer(whoAmI);
        setCurrentPlayerMakeMove(() => makeMove);
    }

    const onGameEnd = (winner: Cell) => {
        setWinner(winner);
    }
  
    const [engine] = useState(() => new Engine(
        onPlayerMove,
        onPlayerMove,
        onGameEnd
    ));
    
    useEffect(() => {
        engine.startGame();
        setCurrentState(engine.getState());
    }, [engine]);

    

    return(
        
        <View>
            {winner === undefined
            ? <Text style = {{color: 'white'}}>{currentPlayer === Cell.X ? 'X' : 'O'}, it's your move!</Text>
            : <Text style = {{color: 'white'}}>{getEndgameText(winner)}</Text>
            }

            {currentState
            ?  (
                <GameBoard
                    state = {engine.getState()}
                    onCellPress={(x, y) => currentPlayerMakeMove?.(x, y)}
                />
                )
            :   <Text style = {{color: 'white'}}>Loading...</Text>
            }            
        </View>
    );
}

