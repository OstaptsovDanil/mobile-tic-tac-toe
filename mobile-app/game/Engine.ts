import { StatusBarIOS } from "react-native";

export enum Cell {
    Empty,
    X,
    O
}

export type State = Cell[][];

export type MakeMoveFn = (x: number, y:number) => void;

export type OnMoveFn = (state: State, whoAmI: Cell.X | Cell.O, makeMove: MakeMoveFn) => void;

type OnEndFn = (winner: Cell) => void;

type PlayerSide = Cell.X | Cell.O | 'random';

export default class Engine{
    static BOARD_SIZE = 3;

    private state: State;
    private isOver: boolean;
    private onPlayerXMove: OnMoveFn;
    private onPlayerOMove: OnMoveFn;
    private onGameEnd: OnEndFn;

    constructor(
        onPlayerOneMove: OnMoveFn,
        onPlayerTwoMove: OnMoveFn,
        onGameEnd: OnEndFn,
        playerOneSide: PlayerSide = Cell.X
        ) {
       this.state = [
           [Cell.Empty, Cell.Empty, Cell.Empty],
           [Cell.Empty, Cell.Empty, Cell.Empty],
           [Cell.Empty, Cell.Empty, Cell.Empty]
       ];

       this.isOver = false;

       if (playerOneSide === 'random'){
           playerOneSide = Math.random() > 0.5 ? Cell.X : Cell.O;
       }

       if (playerOneSide === Cell.X){
        this.onPlayerXMove = onPlayerOneMove;
        this.onPlayerOMove = onPlayerTwoMove;
       } else {
        this.onPlayerXMove = onPlayerTwoMove;
        this.onPlayerOMove = onPlayerOneMove;
       }

       this.onGameEnd = onGameEnd;
    }

    getState(): State{
        return [
            [...this.state[0]],
            [...this.state[1]],
            [...this.state[2]]
        ];
    }

    startGame() {
        const playerXMakeMove = this.getMakeMoveFn(Cell.X);
        this.onPlayerXMove(this.state, Cell.X, playerXMakeMove);
    }

    private isGameOver(): {isOver: true, winner: Cell} | {isOver: false, winner?: undefined} {
        //check rows
        for(let i = 0; i < Engine.BOARD_SIZE; ++i){
            const row = this.state[i];
            if (row[0] !== Cell.Empty && row[0] === row[1] && row[1] === row[2]){
                return {isOver: true, winner: row[0]};
            }
        }
    

        //check columns
        for(let i = 0; i < Engine.BOARD_SIZE; ++i){
            if(this.state[0][i] !== Cell.Empty &&
                this.state[0][i] === this.state[1][i] &&
                this.state[1][i] ===this.state[2][i]
                ){
                    return {isOver: true, winner: this.state[0][i]};
                }
        }

        //check diagonals
        if(this.state[0][0] !== Cell.Empty &&
            this.state[0][0] === this.state[1][1] &&
            this.state[1][1] === this.state[2][2]
            ){
                return{isOver: true, winner: this.state[0][0]}
            }
        
        if(this.state[0][2] !== Cell.Empty &&
            this.state[0][2] === this.state[1][1] &&
            this.state[1][1] === this.state[2][0]
            ){
                return{isOver: true, winner: this.state[0][2]}
            }

        //check draw
        for(let i = 0; i < Engine.BOARD_SIZE; ++i){
            for(let j = 0; j < Engine.BOARD_SIZE; ++j){
                if(this.state[i][j] === Cell.Empty){
                    return {isOver: false}
                }
            }
        }
        
        return {isOver: true, winner: Cell.Empty}
    }

    private getMakeMoveFn (type: Cell.X | Cell.O): MakeMoveFn{
        let wasCalled = false;

        return (x: number, y: number) => {
            if(this.isOver){
                throw new Error('Нельзя сделать ход после окончания игры!');
            }
            if(wasCalled){
                throw new Error ('Нельзя сделать 2 хода подряд!');
            }
            if(this.state[x][y] != Cell.Empty){
                throw new Error('Нельзя сделать ход в уже занятую клетку!');
            }
            this.makeMove(type, x, y);
            wasCalled = true;
        }
    }

    private makeMove(type: Cell.X | Cell.O, x: number, y: number){
        this.state[x][y] = type;

        const { isOver, winner } = this.isGameOver();
        if(isOver){
            this.isOver = true;
            this.onGameEnd(winner);
            return;
        }

        if (type === Cell.X) {
            const playerOMakeMove = this.getMakeMoveFn(Cell.O);
            this.onPlayerOMove(this.state, Cell.O, playerOMakeMove);
        }else {
            const playerXMakeMove = this.getMakeMoveFn(Cell.X);
            this.onPlayerXMove(this.state, Cell.X, playerXMakeMove);
        }
    }
}