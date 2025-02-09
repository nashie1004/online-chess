import { Col, Form } from 'react-bootstrap'
import useLocalStorage from '../../hooks/useLocalStorage';
import { boardUIArray, pieceUIArray } from '../../game/utilities/constants';
import { useMemo } from 'react';

export default function UIChanger() {
  const { setValue: setBoard, data: board } = useLocalStorage("board", "green.png");
  const { setValue: setPiece, data: piece } = useLocalStorage("piece", "cburnett");

  const boardPath = `/src/assets/boards/${board}`;
  const piecePath = `/src/assets/pieces/${piece}/`;
  
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
              onChange={(e) => setBoard(e.target.value)}
              className='w-50'>
                {boardUIArray.map((item, idx) => {
                  return <option key={idx} value={item.displayCode}>{item.displayName}</option>
                })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 d-flex">
            <Form.Label column sm={2}>
              Piece
            </Form.Label>
            <Form.Select  
              onChange={(e) => setPiece(e.target.value)}
              className='w-50'>
              {pieceUIArray.map((item, idx) => {
                return <option key={idx} value={item.displayCode}>{item.displayName}</option>
              })}
            </Form.Select>
          </Form.Group>
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
