import React from "react";
import {Form, Input, Select, SelectItem, Checkbox, Button, CardBody, CardFooter, CardHeader, Card, Divider, Avatar} from "@nextui-org/react";
import { NavLink } from "react-router";

export default function Profile() {
  const onSubmit = () => {

  }

  return (
    <div className="flex justify-center items-center h-100 min-h-full" style={{ minHeight: "100% !important"}}>
      <h2>Profile Information</h2>
      <h2>Game History</h2>
      <Card style={{ width: 500}}>
        <CardHeader className="flex text-center justify-center">
        <Avatar
        className="w-20 h-20 text-large"
        showFallback
        // src="https://i.pravatar.cc/150?u=a04258114e29026708c"
        src="https://i.pravatar.cc/150?u=a04258114e29026708c"
      />
        </CardHeader>
        <Divider />
        <CardBody>
    <Form
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      
          <Input
            isDisabled
            isRequired
            label="Name"
            value={"Lorem ipsum dolor sit."}
            labelPlacement="outside"
            name="name"
            placeholder="Enter your name"
            className="mb-2"
          />
          <Input
          isDisabled
            isRequired
            value={"Lorem ipsum dolor sit."}
            label="Password"
            labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
          
        <Checkbox
          isRequired
          classNames={{
            label: "text-small",
          }}
          name="terms"
          validationBehavior="aria"
          value="true"
        >
          Edit Profile
        </Checkbox>
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

