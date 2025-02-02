import { useCallback } from "react";
import { eventEmitter } from "../utilities/eventEmitter";
import { IPieceMove } from "../utilities/types";
import { eventEmit } from "../utilities/constants";

export default function useOnOpponentPieceMoved(){

    const onOpponentPieceMoved = useCallback((data: any) => {
        eventEmitter.emit(eventEmit.setEnemyMove, data.moveInfo as IPieceMove);
    }, []);

    return onOpponentPieceMoved;
}