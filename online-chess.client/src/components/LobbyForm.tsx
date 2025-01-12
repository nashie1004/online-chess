import React from 'react'
import { GameType } from '../game/utilities/constants';
import { gameTypeDisplay } from '../utils/helper';
import { Form } from 'react-bootstrap';
import useSignalRContext from '../hooks/useSignalRContext';
import { IGameRoomList } from '../game/utilities/types';

interface ILobbyForm{
    setGameType: React.Dispatch<React.SetStateAction<GameType>>;
    gameType: GameType;
    setGameRoomList: React.Dispatch<React.SetStateAction<IGameRoomList>>;
}

const gameTypes = [ GameType.Classical, GameType.Blitz3Mins, GameType.Blitz5Mins, GameType.Rapid10Mins, GameType.Rapid25Mins ];

export default function LobbyForm(
    { setGameType, gameType, setGameRoomList }: ILobbyForm
) {
    const { invoke } = useSignalRContext();

  return (
    <>
        <div className="mt-5 mt-3 w-50">
            <h3 className="">Find a match</h3>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    setGameRoomList(prev => ({ ...prev, isLoading: true }));
                    invoke("AddToQueue", gameType)
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
                        <option selected disabled>Choose Game Type</option>
                        {
                            gameTypes.map((item, idx) => {
                                return <option key={idx} value={gameType}>
                                    {gameTypeDisplay(item)}
                                </option>
                            })
                        }
                    </Form.Select>
                </Form.Group>
                <button type="submit" className="btn btn-primary w-100">Queue</button>
            </Form>
        </div>
    </>
  )
}
