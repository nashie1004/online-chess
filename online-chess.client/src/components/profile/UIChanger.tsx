import { Col, Form } from 'react-bootstrap'
import { useMemo } from 'react';
import boardUIOptions from '../../constants/boardUI';
import pieceUIOptions from '../../constants/pieceUI';
import useSignalRContext from '../../hooks/useSignalRContext';
import useUserPreferenceContext from '../../hooks/useUserPreferenceContext';
import { eventEmitter } from '../../game/utilities/eventEmitter';
import { EVENT_ON } from '../../constants/emitters';

export default function UIChanger() {
  const { userConnectionId } = useSignalRContext();
  const { setBoard, setPiece, setShowCoords, boardUI, pieceUI, showCoords } = useUserPreferenceContext();

  const boardPath = `/src/assets/boards/${boardUI}`;
  const piecePath = `/src/assets/pieces/${pieceUI}/`;
  
  const pieces = useMemo(() => {
    return [
      { coords: "3-3", piece: "wK.svg" },
      { coords: "4-3", piece: "wQ.svg" },
      { coords: "3-4", piece: "bK.svg" },
      { coords: "4-4", piece: "bQ.svg" },
    ];
  }, []);

  return (
    <>
        <div className="table-title mt-3">
            <h5 className="">
                <i className="bi bi-gear-fill" style={{ color: "#FFFFFF", fontSize: "1.5rem" }}></i>
                <span className="ps-2">BOARDS AND PIECES</span>
            </h5>
        </div>

        <div className='ui-selector mb-5'>
          <Col>
          <Form className=''>
          <Form.Group className="mb-3 d-flex">
            <Form.Label column sm={2}>
              Board
            </Form.Label>
            <Form.Select 
              disabled={!userConnectionId}
              onChange={(e) => setBoard(e.target.value)}
              value={boardUI}
              className='w-50'>
                {boardUIOptions.map((item, idx) => {
                  return <option key={idx} value={item.displayCode}>{item.displayName}</option>
                })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 d-flex">
            <Form.Label column sm={2}>Piece</Form.Label>
            <Form.Select  
              disabled={!userConnectionId}
              onChange={(e) => setPiece(e.target.value)}
              value={pieceUI}
              className='w-50'>
              {pieceUIOptions.map((item, idx) => {
                return <option key={idx} value={item.displayCode}>{item.displayName}</option>
              })}
            </Form.Select>
          </Form.Group>
          {/* <Form.Group className="mb-3 d-flex">
              <Form.Label column sm={3}>Show Coordinates:</Form.Label>
              <Form.Check
                className='d-flex justify-content-center align-items-center'
                  checked={showCoords}
                  onChange={() => {
                      setShowCoords(!showCoords ? "true" : "false");
                      eventEmitter.emit(EVENT_ON.SET_COORDS_UI_SHOW, !showCoords);
                  }}
              />
          </Form.Group> */}
        </Form>
          </Col>
          <Col className='ui-display d-flex justify-content-center' id="ui-changer-container">
              <div id="ui-board" className="chessboard" style={{ backgroundImage: `url(${boardPath})` }}>
              {Array(8)
                .fill(null)
                .map((_, rowIdx) =>
                  Array(8)
                    .fill(null)
                    .map((__, colIdx) => {
                      const key = `${colIdx}-${rowIdx}`;
                      const isCenter = (rowIdx === 3 || rowIdx === 4) && (colIdx === 3 || colIdx === 4);
                      const src = pieces.find(i => i.coords === key)

                      return (
                        <div key={key} className="square">
                          {/* Place Kings at center squares */}
                          {isCenter && (
                            <img
                              src={piecePath + src?.piece}
                              alt={rowIdx === 3 ? "White King" : "Black King"}
                              className="piece"
                            />
                          )}
                        </div>
                      );
                    })
                )}
            </div>
          </Col>
        </div>

    </>
  )
}
