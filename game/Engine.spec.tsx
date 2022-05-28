import Engine, { Cell }  from "./Engine";

describe('Engine', () => {
    it('starts with empty state', () => {
        const engine = new Engine(() => {}, () => {}, () => {});
        const state = engine.getState();

        expect(state).toStrictEqual([
            [Cell.Empty, Cell.Empty, Cell.Empty],
            [Cell.Empty, Cell.Empty, Cell.Empty],
            [Cell.Empty, Cell.Empty, Cell.Empty]
        ])
    });

    it('should allow players to make move', () => {
        const onPlayerOneMove = jest.fn((state, whoAmI, makeMove) => {
            if (state[0][0] === Cell.Empty) {
                makeMove(0,0);
            }
        })
        const onPlayerTwoMove = jest.fn((state, whoAmI, makeMove) => {
            if (state[0][1] === Cell.Empty) {
                makeMove(0,1);
            }
        })

        const engine = new Engine(onPlayerOneMove, onPlayerTwoMove, ()=>{});
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

    it('should make player one go X by default', () => {
        const onPlayerOneMove = jest.fn();
    
        const engine = new Engine(onPlayerOneMove, () => {}, ()=> {});
        engine.startGame();
    
        expect(onPlayerOneMove).toHaveBeenCalledWith(expect.anything(), Cell.X, expect.any(Function));
    });
    
    it('should allow player one go O', () => {
        const onPlayerOneMove = jest.fn();
        const onPlayerTwoMove = jest.fn((state, whoAmI, makeMove) => {
            makeMove(0,0);
        });
    
        const engine = new Engine(onPlayerOneMove, onPlayerTwoMove, () => {}, Cell.O);
        engine.startGame();
    
        expect(onPlayerOneMove).toHaveBeenCalledWith(expect.anything(), Cell.O, expect.any(Function));
        expect(onPlayerTwoMove).toHaveBeenCalledWith(expect.anything(), Cell.X, expect.any(Function));
    })

    it ('should allow assigning a side randomly', () => {
        const onPlayerOneMove = jest.fn();
        const onPlayerTwoMove = jest.fn((state, whoAmI, makeMove) => {
            makeMove(0,0);
        });

        const spyedOnMathRandom = jest.spyOn(Math, 'random');

        spyedOnMathRandom.mockReturnValueOnce(0.7);
        const engineOne = new Engine(onPlayerOneMove, onPlayerTwoMove, () => {}, 'random');
        engineOne.startGame();
        expect(spyedOnMathRandom).toHaveBeenCalled();
        expect(onPlayerOneMove).toHaveBeenCalledWith(expect.anything(), Cell.X, expect.any(Function));

        spyedOnMathRandom.mockReset();
        onPlayerOneMove.mockReset();

        spyedOnMathRandom.mockReturnValueOnce(0.4);
        const engineTwo = new Engine(onPlayerOneMove, onPlayerTwoMove, () => {}, 'random');
        engineTwo.startGame();
        expect(spyedOnMathRandom).toHaveBeenCalled();
        expect(onPlayerOneMove).toHaveBeenCalledWith(expect.anything(), Cell.O, expect.any(Function));
    });
    
});



