import { OnMoveFn } from "../../../game/Engine"
import { useQuery } from "react-query";
import axios from "axios";
import {ServerState} from '../../../../server/index';

const SERVER_URL = 'http://localhost:3000';

function usePlayerId(gameId: string | undefined){
    return useQuery(
        ['playerId', gameId],
        ({signal}) => {
            if(!gameId){
                return;
            }
            return axios.post(`${SERVER_URL}/register`, {signal});
        },
        
        {
            cacheTime: Infinity,
            retry: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    );
}

export function useNetworkGame(gameId: string){
    const { data: playerId, error, isError, isLoading } = usePlayerId(gameId);

    return useQuery(
        ['networkGame', gameId, isLoading, isError],
        ({signal}) => {
            if(isError){
                throw error;
            }

            return axios.get(`${SERVER_URL}/${playerId}/state`, { signal });
        },
        {
            enabled: !isLoading,
            retry: false,
            cacheTime: Infinity,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchInterval: (data: ServerState | undefined) => {
                if(data?.status === 'pending') {
                    return 250;
                }
                return false;
            },
        }
        
    );
}

const onNetworkPlayer: OnMoveFn = (state, whoAmI, makeMove) => {

};

export default onNetworkPlayer;