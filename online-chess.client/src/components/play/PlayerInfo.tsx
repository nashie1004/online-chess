import { useEffect, useState } from 'react'
import useGameContext from '../../hooks/useGameContext';
import { msToMinuteDisplay } from '../../utils/helper';
import useSignalRContext from '../../hooks/useSignalRContext';
import { playPageHandlers } from '../../game/utilities/constants';

export default function PlayerInfo() {
    const { gameState } = useGameContext();
    const [actualTime, setActualTime] = useState({ white: 0, black: 0, whitesTurn: false });
    const { addHandler, removeHandler } = useSignalRContext();

    const white = gameState.myInfo.playerIsWhite ? gameState.myInfo : gameState.opponentInfo;
    const black = !gameState.myInfo.playerIsWhite ? gameState.myInfo : gameState.opponentInfo;

    useEffect(() => {

        async function startTimer(){
            await addHandler(playPageHandlers.onUpdateTimer, (data: any) => {
                const white = data.white as number;
                const black = data.black as number;
                const whitesTurn = data.whitesTurn as boolean;

                console.log(data);

                setActualTime({ white, black, whitesTurn });
            });            
        }

        if (gameState.gameStatus === "ONGOING"){
            startTimer();
        }

        return () => {
            removeHandler(playPageHandlers.onUpdateTimer);
        };

    }, [gameState.gameStatus])

  return (
    <>
        <div className="hstack my-3">
            <div className='timer-info w-100'>
                <h6 className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{msToMinuteDisplay(actualTime.white)}s</span>
                </h2>
            </div>
            <div className='timer-info w-100'>
                <h6  className='text-secondary'>Lorem, ipsum.</h6>
                <h2>
                    <i className="bi bi-clock"></i> <span>{msToMinuteDisplay(actualTime.black)}s</span>
                </h2>
            </div>
        </div>
        <div className='game-alert'>
            {actualTime.whitesTurn ? <>White's</> : <>Black's</>} turn to move.
            {
                white.kingsState.isInCheck || black.kingsState.isInCheck ? <>
                    {white.kingsState.isInCheck ? " White is in check." : ""}
                    {black.kingsState.isInCheck ? " Black is in check." : ""}
                </> : <></> 
            }
            {
                white.kingsState.isCheckMate || black.kingsState.isCheckMate ? <>
                    {white.kingsState.isCheckMate ? " White is checkmated." : ""}
                    {black.kingsState.isCheckMate ? " Black is checkmated." : ""}
                </> : <></> 
            }
            {
                white.kingsState.isInStalemate || black.kingsState.isInStalemate ? <>
                Stalemate.
                </> : <></> 
            }
        </div>
    </>
  )
}
