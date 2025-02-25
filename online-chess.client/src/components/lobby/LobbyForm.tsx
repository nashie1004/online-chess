import React, { useState } from 'react'
import { ColorOptions, GameType } from '../../game/utilities/constants';
import { colorOptionsDisplay, gameTypeDisplay } from '../../utils/helper';
import { Form } from 'react-bootstrap';
import useSignalRContext from '../../hooks/useSignalRContext';
import { IGameRoomList } from '../../game/utilities/types';
import { LOBBY_PAGE_INVOKERS } from '../../constants/invokers';
import useGameContext from '../../hooks/useGameContext';

interface ILobbyForm{
    setGameRoomList: React.Dispatch<React.SetStateAction<IGameRoomList>>;
    roomKey: string | null;
}

const gameTypes = [ GameType.Classical, GameType.Blitz3Mins, GameType.Blitz5Mins, GameType.Rapid10Mins, GameType.Rapid25Mins ];
const colorOptions = [ ColorOptions.White, ColorOptions.Black, ColorOptions.Random ];

export default function LobbyForm(
    { setGameRoomList, roomKey }: ILobbyForm
) {
    const { invoke, userConnectionId } = useSignalRContext();
    const [gameType, setGameType] = useState<GameType>(1);
    const [colorOption, setColorOption] = useState<ColorOptions>(1);
    const { gameState } = useGameContext();

    const disableQueueBtn = (roomKey ? true : false) || 
        (gameState.gameRoomKey !== null ? true : false) || 
        (userConnectionId === null ? true : false);

    // console.log(roomKey, gameState.gameRoomKey, userConnectionId)

  return (
    <>
        <div className="mt-5 mb-3 w-50">
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    setGameRoomList(prev => ({ ...prev, isLoading: true }));
                    invoke(LOBBY_PAGE_INVOKERS.ADD_TO_QUEUE, gameType, colorOption)
                }}
                className='match-form'
            >
                <div className="match-form-header">
                    <h5 className="">
                        <i className="bi bi-broadcast-pin pe-2"  style={{ color: "#FFEB3B", fontSize: "1.6rem" }}></i> CREATE A MATCH
                    </h5>
                </div>
                <div className="match-form-body pb-4">
                    <Form.Group className="mb-3">
                        <Form.Select 
                            disabled={disableQueueBtn} 
                            onChange={(e) => {
                                const val = Number(e.target.value) as GameType;
                                setGameType(val);
                            }}
                            aria-label="Game Type"
                        >
                            {gameTypes.map((item, idx) => {
                                return <option key={idx} value={item}>
                                    {gameTypeDisplay(item)}
                                </option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Select
                            disabled={disableQueueBtn} 
                            onChange={(e) => {
                                const val = Number(e.target.value) as ColorOptions;
                                setColorOption(val);
                            }}
                        >
                            {colorOptions.map((item, idx) => {
                                return <option value={item} key={idx}>
                                    {colorOptionsDisplay(item)}
                                </option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <button
                        disabled={disableQueueBtn} 
                        type="submit" className="btn btn-1 w-100">Queue</button>
                </div>
            </Form>
        </div>
    </>
  )
}
