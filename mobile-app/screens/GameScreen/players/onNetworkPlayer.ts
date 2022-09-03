import Engine, { Cell, OnMoveFn } from "../../../game/Engine"
import { useQuery } from "react-query";
import axios from "axios";
import {ServerState} from '../../../../server/index';
import { State } from "../../../game/Engine";

const SERVER_URL = 'https://042a-78-191-23-196.eu.ngrok.io';

export const NETWORK_GAME_QUERY_CACHE_KEY = 'networkGame';

function usePlayerId(enabled: boolean){
    return useQuery(
        [NETWORK_GAME_QUERY_CACHE_KEY, 'usePlayerId'],
        async ({signal}) => {
            if(!enabled) return;

            const response = await axios.post(`${SERVER_URL}/register`, {signal});
            return response.data;
        },
        
        {
            cacheTime: Infinity,
            retry: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    );
}

export function useNetworkGame(enabled: boolean){
    const { data: playerId, error, isError, isLoading } = usePlayerId(enabled);

    return useQuery(
        [NETWORK_GAME_QUERY_CACHE_KEY, 'useNetworkGame'],
        async ({signal}) => {
            if(isError) throw error;
            if(!playerId) throw new Error('Player ID is not defined');

            let response = await axios.get(`${SERVER_URL}/${playerId}/state`, { signal });
            while (response.data?.status === 'pending'){
                await new Promise(resolve => setTimeout(resolve, 250));
                response = await axios.get(`${SERVER_URL}/${playerId}/state`, { signal });
            }
            return { ...response.data, playerId };
        },
        {
            enabled: !isLoading,
            retry: false,
            cacheTime: Infinity,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }        
    );
}

async function getNewMessages(playerId: string) {
    let response = await axios.get(`${SERVER_URL}/${playerId}/state`);
    while (!response.data.messages?.length) {
      await new Promise(resolve => setTimeout(resolve, 250));
      response = await axios.get(`${SERVER_URL}/${playerId}/state`);
    }
    return response.data.messages;
  }

function getNetworkPlayer(playerId: string): OnMoveFn {
    let previousState: State | undefined = undefined;

    return (state, whoAmI, makeMove) => {
        for (let i = 0; i < Engine.BOARD_SIZE; i++){
            for (let j = 0; j < Engine.BOARD_SIZE; j++) {
                const foundNewMove = previousState
                    ? (state [i][j] !== previousState[i][j])
                    : (state[i][j] !== Cell.Empty);
                if (foundNewMove && state[i][j] !== whoAmI) {
                    axios.post(`${SERVER_URL}/${playerId}/message`, {
                        type: 'move',
                        move: [i, j],
                    });
                    break;
                }
            }
        }
        
        previousState = [
            [...state[0]],
            [...state[1]],
            [...state[2]]
        ];

        getNewMessages(playerId).then(messages => {
            makeMove(...(messages[0].move as [number, number]));
        });
    };
}



export default getNetworkPlayer;