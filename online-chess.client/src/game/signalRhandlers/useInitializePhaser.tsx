import moment from "moment";
import { useCallback } from "react";
import { MainGameScene } from "../scenes/MainGameScene";
import { eventEmitter } from "../utilities/eventEmitter";
import { IInitialGameInfo, IKingState } from "../utilities/types";
import { Options as gameOptions } from "../utilities/constants";
import usePhaserContext from "../../hooks/usePhaserContext";
import useGameContext from "../../hooks/useGameContext";
import useSignalRContext from "../../hooks/useSignalRContext";
import useAuthContext from "../../hooks/useAuthContext";

export default function useInitializePhaser(
    gameRef: React.MutableRefObject<Phaser.Game | null | undefined>
){
    const {  setGameRoomKey, setTimer } = useGameContext();
    const { setKingsState } = usePhaserContext();
    const signalRContext = useSignalRContext();
    const { user } = useAuthContext();

    const initPhaser = useCallback((initGameInfo: IInitialGameInfo) => {
        const createdByUserTime = moment.duration(initGameInfo.createdByUserInfo.timeLeft).asMilliseconds();
        const joinedByUserTime = moment.duration(initGameInfo.joinedByUserInfo.timeLeft).asMilliseconds();

        const playerIsWhite = (initGameInfo.createdByUserInfo.userName === user?.userName)
            ? initGameInfo.createdByUserInfo.isColorWhite
            : initGameInfo.joinedByUserInfo.isColorWhite;

        setTimer({
            white: playerIsWhite && initGameInfo.createdByUserInfo.userName === user?.userName ? createdByUserTime : joinedByUserTime,
            black: !playerIsWhite && initGameInfo.createdByUserInfo.userName !== user?.userName ? joinedByUserTime : createdByUserTime,
            isWhitesTurn: true
        });

        setGameRoomKey(initGameInfo.gameRoomKey);

        // init phaser
        if (!gameRef.current){
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: gameOptions.width,
                height: gameOptions.height,
                parent: 'game-container',
                backgroundColor: '#028af8',
                scale: {
                    // mode: Phaser.Scale.RESIZE
                },
                scene: [
                    new MainGameScene("mainChessboard", playerIsWhite)
                ],
            });
        }

        // connect react and phaser
        //eventEmitter.on("setIsWhitesTurn", (data: boolean) => setIsWhitesTurn(data));
        // eventEmitter.on("setMoveHistory", (data: IMoveHistory) => setMoveHistory(data));
        // eventEmitter.on("setCaptureHistory", (data: ICaptureHistory) => setCaptureHistory(data));
        eventEmitter.on("setKingsState", (data: IKingState) => setKingsState(data));
        eventEmitter.on("setMovePiece", (move: any) => {
            signalRContext.invoke("MovePiece", initGameInfo.gameRoomKey, move.oldMove, move.newMove);
            // console.log("You moved a piece")
        });
    }, []);

    return initPhaser;
}