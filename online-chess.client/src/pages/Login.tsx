import React from "react";
import {Form, Input, Select, SelectItem, Checkbox, Button, CardBody, CardFooter, CardHeader, Card, Divider} from "@nextui-org/react";
import { NavLink } from "react-router";

export default function Login() {
  const onSubmit = () => {

  }

  return (
    <div className="flex justify-center items-center h-100 min-h-full" style={{ minHeight: "100% !important"}}>
      <Card style={{ width: 500}}>
        <CardHeader className="flex-col items-start">
          <h1 className="mt-4 font-bold text-4xl">Login</h1>
          <small className="text-default-500">Sign in to your account or <NavLink className="text-white" to="/register">Register</NavLink></small>
        </CardHeader>
        <Divider />
        <CardBody>
    <Form
      validationBehavior="native"
      onSubmit={onSubmit}
    >
          <Input
            isRequired
            label="Name"
            labelPlacement="outside"
            name="name"
            placeholder="Enter your name"
            className="mb-2"
          />
          <Input
            isRequired
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
    </Form>
        </CardBody>
        <CardFooter className="flex gap-2">
            <Button className="flex-1" color="primary" type="submit">
              Submit
            </Button>
            <Button type="reset" className="flex-1" variant="bordered">
              Reset
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

