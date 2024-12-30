import usePhaser from '../hooks/usePhaser';
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button, Select, SelectItem, Spacer, ButtonGroup, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import PlayerInfo from './ui/PlayerInfo';
import MailIcon from './ui/MainInfo';

export default function SidebarRight() {
  const { isColorWhite, promoteTo, setPromoteTo } = usePhaser();

  return (
    <div id="sidebar-right"  
      className='p-4 d-flex justify-content-center align-items-center'>
        <Card className=' bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
          <CardHeader>
            <p>Player Information</p>
          </CardHeader>
          <Divider />
          <CardBody>
            <PlayerInfo />
          </CardBody>
        </Card>
      <Spacer y={5} />
      
    <Spacer y={5} />
    <Card className=' bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
      <CardHeader>
        <p>Chat Bar</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <div style={{ height: "350px", overflowY: "scroll" }}>

            <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key="1">
              <TableCell>Tony Reichert</TableCell>
              <TableCell>CEO</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Zoey Lang</TableCell>
              <TableCell>Technical Lead</TableCell>
              <TableCell>Paused</TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>Jane Fisher</TableCell>
              <TableCell>Senior Developer</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell>William Howard</TableCell>
              <TableCell>Community Manager</TableCell>
              <TableCell>Vacation</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        </div>
        <Spacer y={3} />
        <div className='flex gap-1'>
          <Input
            placeholder="you@example.com"
            startContent={
              <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="text"
          />
          <Button color='primary' size='md'>
            Send
          </Button>
        </div>
      </CardBody>
    </Card>
    </div>
  )
}
