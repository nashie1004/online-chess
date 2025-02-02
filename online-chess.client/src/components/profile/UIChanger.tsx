import React, { useState } from 'react'
import { Tabs, Tab, Button, Col, Form, Row, Image } from 'react-bootstrap'
import testBg from "../../assets/boards/blue.png"
import testing from "../../assets/pieces/cburnett/bB.svg"

export default function UIChanger() {
    const [board, setBoard] = useState("");
    const [piece, setPiece] = useState("");

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
                setBoard("");
              }}
              aria-label="Default select example" className='w-50'>
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3 d-flex">
            <Form.Label column sm={2}>
              Piece
            </Form.Label>
            <Form.Select aria-label="Default select example" className='w-50'>
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
          </Form.Group>
        </Form>
          </Col>
          <Col className='ui-display d-flex justify-content-center'>
              <Image src={testBg} width={480} fluid />
              {/* <Image src={testing} width={60} fluid /> */}
          </Col>
        </div>

    </>
  )
}
