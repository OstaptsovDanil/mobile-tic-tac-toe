
export enum Cell {
    Empty,
    X,
    O
}

type State = Cell[][];

type MakeMoveFn = (x: number, y:number) => void;

type OnMoveFn = (state: State, makeMove: MakeMoveFn) => void;

export default class Engine{
    private state: State;
    private onPlayerXMove: OnMoveFn;
    private onPlayerOMove: OnMoveFn;

    constructor(onPlayerOneMove: OnMoveFn, onPlayerTwoMove: OnMoveFn) {
       this.state = [
           [Cell.Empty, Cell.Empty, Cell.Empty],
           [Cell.Empty, Cell.Empty, Cell.Empty],
           [Cell.Empty, Cell.Empty, Cell.Empty]
       ];

       this.onPlayerXMove = onPlayerOneMove;
       this.onPlayerOMove = onPlayerTwoMove;
    }

    getState(): Cell[][]{
        return this.state;
    }

    startGame() {
        const playerXMakeMove = (x: number, y: number) => this.makeMove(Cell.X, x, y);
        this.onPlayerXMove(this.state, playerXMakeMove);
    }
    private makeMove(type: Cell.X | Cell.O, x: number, y: number){
        if (this.state[x][y] != Cell.Empty){
            throw new Error('Нельзя сделать ход в занятую клетку!')
        }

        this.state[x][y] = type;

        if (type === Cell.X) {
            const playerOMakeMove = (x: number, y: number) => this.makeMove(Cell.O, x, y);
            this.onPlayerOMove(this.state, playerOMakeMove);
        }else {
            const playerXMakeMove = (x: number, y: number) => this.makeMove(Cell.X, x, y);
            this.onPlayerXMove(this.state, playerXMakeMove);
        }
    }    
}