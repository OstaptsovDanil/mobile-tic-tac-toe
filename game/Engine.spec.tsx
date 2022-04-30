import Engine, { Cell }  from "./Engine";

describe('Engine', () => {
    it('starts with empty state', () => {
        const engine = new Engine(() => {}, () => {});
        const state = engine.getState();

        expect(state).toStrictEqual([
            [Cell.Empty, Cell.Empty, Cell.Empty],
            [Cell.Empty, Cell.Empty, Cell.Empty],
            [Cell.Empty, Cell.Empty, Cell.Empty]
        ])
    });

    it('should allow players to make move', () => {
        const onPlayerOneMove = jest.fn((state, makeMove) => {
            if (state[0][0] === Cell.Empty) {
                makeMove(0,0);
            }
        })
        const onPlayerTwoMove = jest.fn((state, makeMove) => {
            if (state[0][1] === Cell.Empty) {
                makeMove(0,1);
            }
        })

        const engine = new Engine(onPlayerOneMove, onPlayerTwoMove);
        engine.startGame();

        expect(onPlayerOneMove).toHaveBeenCalled();
        expect(onPlayerTwoMove).toHaveBeenCalled();

        const state = engine.getState();

        expect(state).toStrictEqual([
            [Cell.X, Cell.O, Cell.Empty],
            [Cell.Empty, Cell.Empty, Cell.Empty],
            [Cell.Empty, Cell.Empty, Cell.Empty]
        ])
    })
});
