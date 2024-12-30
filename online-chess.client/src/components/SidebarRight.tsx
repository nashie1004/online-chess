import usePhaser from '../hooks/usePhaser';
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button, Select, SelectItem, Spacer, ButtonGroup, Input} from "@nextui-org/react";
import PlayerInfo from './ui/PlayerInfo';
import MailIcon from './ui/MainInfo';

export default function SidebarRight() {
  const { isColorWhite, promoteTo, setPromoteTo } = usePhaser();

  return (
    <div id="sidebar-right"  
      className='p-4 d-flex justify-content-center align-items-center'>
        <Card>
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
    <Card>
      <CardHeader>
        <p>Chat Bar</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <ul>
          <li>Lorem ipsum dolor sit amet.</li>
          <li>Soluta aperiam ut facere ex.</li>
          <li>Tempore omnis eaque quam obcaecati?</li>
          <li>Porro pariatur placeat harum adipisci?</li>
        </ul>
        <Spacer y={3} />
        <div className='flex gap-3'>
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
