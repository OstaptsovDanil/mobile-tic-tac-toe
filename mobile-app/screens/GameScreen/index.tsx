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

    

    const onDanilBotMove: OnMoveFn = (state, whoAmI, makeMove) => {
        const board: State = state;
        setCurrentPlayer(whoAmI);   
        
        const winning = (board: State, player: Cell.X | Cell.O) => {
            if(
                (board[0][0] === player && board[0][1] === player && board[0][2] === player) ||
                (board[1][0] === player && board[1][1] === player && board[1][2] === player) ||
                (board[2][0] === player && board[2][1] === player && board[2][2] === player) ||
                (board[0][0] === player && board[1][0] === player && board[2][0] === player) ||
                (board[0][1] === player && board[1][1] === player && board[2][1] === player) ||
                (board[0][2] === player && board[1][2] === player && board[2][2] === player) ||
                (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
                (board[0][2] === player && board[1][1] === player && board[2][0] === player)
            ){
                return true;
            } else{
                return false;
            }
        };
        
        const minimax = (newBoard: State, player: Cell.X | Cell.O): { position: number[], score: number } => {
            const emptyCells = [];
            let enemyPlayer: Cell.X | Cell.O;

            if(whoAmI === Cell.X){
                enemyPlayer = Cell.O;
            } else {
                enemyPlayer = Cell.X;
            }           

            if(winning(newBoard, whoAmI)){
                return {position: [1, 1], score: 1};
            }else if(winning(newBoard, enemyPlayer)){
                return {position: [1, 1], score: -1}
            }else if(emptyCells.length === 0) {
                return {position: [1, 1], score: 0}
            }

            for (let x = 0; x < Engine.BOARD_SIZE; x++){
                for (let y = 0; y < Engine.BOARD_SIZE; y++){
                    if (state[x][y] === Cell.Empty){
                        emptyCells.push([x, y]);
                    }
                }
            }

            let moves = [];
            for(var i = 0; i < emptyCells.length; i++){
                let move = {
                    position: [emptyCells[i][0], emptyCells[i][1]],
                    score: 0
                };
                newBoard[emptyCells[i][0]][emptyCells[i][1]] = player;

                if(player === whoAmI){
                    let result = minimax(newBoard, enemyPlayer);
                    move.score = result.score;
                }else{
                    let result = minimax(newBoard, whoAmI);
                    move.score = result.score;
                }

                newBoard[emptyCells[i][0]][emptyCells[i][1]] = Cell.Empty;
                moves.push(move);       
            }

            var bestMove = 0;
            if(player = whoAmI){
                var bestScore = -1000;
                for(var i = 0; i < moves.length; i++){
                    if(moves[i].score > bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }else{
                var bestScore = 1000;
                for(var i = 0; i < moves.length; i++){
                    if(moves[i].score < bestScore){
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        }
        const x = minimax(board, whoAmI).position[0];
        const y = minimax(board, whoAmI).position[1];
        makeMove(x, y);
    }

    const onGameEnd = (winner: Cell) => {
        setWinner(winner);
    };
  
    const [engine] = useState(() => {
        const playerTwo = mode === 'pvplocal' ? onPlayerMove : onBotMove;

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
