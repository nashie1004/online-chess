import { Tabs, Tab, Button, Col, Form, Row, Image } from 'react-bootstrap'
import testBg from "../../assets/boards/blue.png"
import useLocalStorage from '../../hooks/useLocalStorage';
import { boardUIArray, pieceUIArray } from '../../game/utilities/constants';
import { array } from 'zod';

export default function UIChanger() {
  const { setValue: setBoard, data: board } = useLocalStorage("board", "green.png");
  const { setValue: setPiece, data: piece } = useLocalStorage("piece", "cburnett");

  const boardPath = `/src/assets/boards/${board}`;
  console.log(boardPath)

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
              onChange={(e) => {
                setBoard(e.target.value);
              }}
              aria-label="Default select example" className='w-50'>
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
              className='w-50'>
              {pieceUIArray.map((item, idx) => {
                return <option key={idx} value={item.displayName}>{item.displayName}</option>
              })}
            </Form.Select>
          </Form.Group>
        </Form>
          </Col>
          <Col className='ui-display d-flex justify-content-center' id="ui-changer-container">
              <div id="ui-board">
                {/* {Array(8).fill(null).map((_, rowIdx) => {
                  return Array(8).fill(null).map((__, colIdx) => {
                    return <div ></div>
                  })
                })} */}
                <img src={boardPath} alt="board" />
              </div>
          </Col>
        </div>

    </>
  )
}
