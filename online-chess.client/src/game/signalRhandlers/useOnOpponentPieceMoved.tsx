import { useCallback } from "react";
import { eventEmitter } from "../utilities/eventEmitter";
import { IPieceMove } from "../utilities/types";

export default function useOnOpponentPieceMoved(){

    const onOpponentPieceMoved = useCallback((data: any) => {
        eventEmitter.emit("setEnemyMove", data.moveInfo as IPieceMove);
    }, []);

    return onOpponentPieceMoved;
}