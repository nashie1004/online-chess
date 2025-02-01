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

        <Form className='ui-selector mb-5'>
                <Image src={testBg} width={480} fluid />
                <Image src={testing} width={60} fluid />
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>
          Board
        </Form.Label>
        <Col sm={10}>
            <Form.Select aria-label="Default select example">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
        </Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column>
          Piece
        </Form.Label>
        <Col sm={10}>
            <Form.Select aria-label="Default select example">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="">
        <Col sm={{  }}>
          <Button type="submit">Save Changes</Button>
        </Col>
      </Form.Group>
    </Form>
    </>
  )
}
