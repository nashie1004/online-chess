import React, { useState } from 'react'
import { ColorOptions, GameType } from '../../game/utilities/constants';
import { colorOptionsDisplay, gameTypeDisplay } from '../../utils/helper';
import { Form } from 'react-bootstrap';
import useSignalRContext from '../../hooks/useSignalRContext';
import { IGameRoomList } from '../../game/utilities/types';

interface ILobbyForm{
    setGameRoomList: React.Dispatch<React.SetStateAction<IGameRoomList>>;
    roomKey: string | null;
}

const gameTypes = [ GameType.Classical, GameType.Blitz3Mins, GameType.Blitz5Mins, GameType.Rapid10Mins, GameType.Rapid25Mins ];
const colorOptions = [ ColorOptions.White, ColorOptions.Black, ColorOptions.Random ];

export default function LobbyForm(
    { setGameRoomList, roomKey }: ILobbyForm
) {
    const { invoke } = useSignalRContext();
    const [gameType, setGameType] = useState<GameType>(1);
    const [colorOption, setColorOption] = useState<ColorOptions>(1);

  return (
    <>
        <div className="mt-5 mt-3 w-50">
            <h3 className="">Find a match</h3>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    setGameRoomList(prev => ({ ...prev, isLoading: true }));
                    invoke("AddToQueue", gameType, colorOption)
                }}
            >
                <Form.Group className="mb-3">
                    <Form.Select 
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
                    disabled={roomKey ? true : false} 
                    type="submit" className="btn btn-primary w-100">Queue</button>
            </Form>
        </div>
    </>
  )
}
