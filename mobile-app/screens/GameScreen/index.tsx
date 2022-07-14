import React, {useEffect, useState} from "react";
import { View, Text, Alert } from 'react-native';
import Engine, {Cell, MakeMoveFn, OnMoveFn, State } from "../../game/Engine";
import GameBoard from "./components/GameBoard";
import { GameMode } from '../WelcomeScreen';

function getEndgameText(winner: Cell): string {
    if(winner === Cell.Empty){
        return 'It\'s a draw!'
    } else{
        return `${winner === Cell.X ? 'X' : 'O'} wins!`
    }
}


interface GameScreenProps {
    mode: GameMode;
}



export default function GameScreen({ mode }: GameScreenProps) {
    const [currentPlayerMakeMove, setCurrentPlayerMakeMove] = useState<MakeMoveFn>();
    const [currentPlayer, setCurrentPlayer] = useState<Cell.X | Cell.O>();
    const [currentState, setCurrentState] = useState<State>();
    const [winner, setWinner] = useState<Cell>();
    
    const onPlayerMove: OnMoveFn = (state, whoAmI, makeMove) => {
        setCurrentPlayer(whoAmI);
        setCurrentPlayerMakeMove(() => makeMove);
    }

    const onBotMove: OnMoveFn = (state, whoAmI, makeMove) => {
        const emptyCells = [];
        for (let x = 0; x < Engine.BOARD_SIZE; x++){
            for (let y = 0; y < Engine.BOARD_SIZE; y++){
                if (state[x][y] === Cell.Empty){
                    emptyCells.push([x, y]);
                }
            }
        }
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [x, y] = emptyCells[randomIndex];
        makeMove(x, y);
    };

    function winning(state: State, who: Cell.X | Cell.O) {       
        if (state[0][0] === who &&
            state[0][0] === state[1][0] &&
            state[1][0] === state[2][0] ||

            state[0][1] === who &&
            state[0][1] === state[1][1] &&
            state[1][1] === state[2][1] ||

            state[0][2] === who &&
            state[0][2] === state[1][2] &&
            state[1][2] === state[2][2] ||


            state[0][0] === who &&
            state[0][0] === state[0][1] &&
            state[0][1] === state[0][2] || 

            state[1][0] === who &&
            state[1][0] === state[1][1] &&
            state[1][1] === state[1][2] || 

            state[2][0] === who &&
            state[2][0] === state[2][1] &&
            state[2][1] === state[2][2] || 


            state[0][0] === who &&
            state[0][0] === state[1][1] &&
            state[1][1] === state[2][2] ||

            state[0][2] === who &&
            state[0][2] === state[1][1] &&
            state[1][1] === [2][0]) {
            return true;
        } else {
            return false;
        }
    }

    const onDanilBotMove: OnMoveFn = (state, whoAmI, makeMove) => {
        //кто я, кто оппонент
        setCurrentPlayer(whoAmI);
        let whoIsOpponent: Cell.X | Cell.O;
        if (whoAmI === Cell.X){
            whoIsOpponent = Cell.O;
        } else{
            whoIsOpponent = Cell.X;
        }
        console.log("игрок: " + whoAmI);
        console.log("бот: " + whoIsOpponent);
        
        //пустые клетки
        const emptyCells = [];
        for (let i = 0; i < Engine.BOARD_SIZE; i++){
            for (let j = 0; j < Engine.BOARD_SIZE; j++){
                if (state[i][j] === Cell.Empty){
                    emptyCells.push([i, j]);
                }
            }
        }
        
        //первый ход в центр
        if(state[1][1] === Cell.Empty){
            makeMove(1,1);
            return;
        }

        for (let i = 0; i < emptyCells.length; i++){
            const newState = [
                [...state[0]],
                [...state[1]],
                [...state[2]]
            ]
            newState[emptyCells[i][0]][emptyCells[i][1]] = whoAmI;
            //если я могу выиграть, то я выигрываю
            if(winning(newState, whoAmI)){
                makeMove(emptyCells[i][0], emptyCells[i][1]);
                return;
            }
            //если противник может выиграть, то я ему мешаю
            newState[emptyCells[i][0]][emptyCells[i][1]] = whoIsOpponent;
            if(winning(newState, whoIsOpponent)){
                makeMove(emptyCells[i][0], emptyCells[i][1]);
                return;               
            }
        }
        //если никто не может выиграть, то хожу в случайную клетку
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [x, y] = emptyCells[randomIndex];
        makeMove(x, y);
        return;
    }

    const onGameEnd = (winner: Cell) => {
        setWinner(winner);
    };
  
    const [engine] = useState(() => {
        const playerTwo = mode === 'pvplocal' ? onPlayerMove : onDanilBotMove;

        return new Engine(
            onPlayerMove,
            playerTwo,
            onGameEnd,
            'random'
        );
    });
    
    useEffect(() => {
        engine.startGame();
        setCurrentState(engine.getState());
    }, [engine]);

    const onCellPress = (x: number, y: number) => {
        try{
            currentPlayerMakeMove?.(x, y);
        }catch(err){
            if (err instanceof Error){
                Alert.alert('Некорректный ход', err.message || err.toString());
            } else{
                Alert.alert('Неккоректный ход', 'неожиданная ошибка');
            }
        }
    }
    
    return(        
        <View>
            {winner === undefined
            ? <Text style = {{color: 'white'}}>{currentPlayer === Cell.X ? 'X' : 'O'}, it's your move!</Text>
            : <Text style = {{color: 'white'}}>{getEndgameText(winner)}</Text>
            }

            {currentState
            ?  (
                <GameBoard state = {engine.getState()} onCellPress={onCellPress} />
                )
            :   <Text style = {{color: 'white'}}>Loading...</Text>
            }            
        </View>
    );
}
