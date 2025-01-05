import usePhaser from '../hooks/usePhaser';
import PlayerInfo from './ui/PlayerInfo';
import MailIcon from './ui/MainInfo';

export default function SidebarRight() {
  const { isColorWhite, promoteTo, setPromoteTo } = usePhaser();

  return (
    <div className='flex-1 p-4'>
        <div className=' bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
          <div>
            <p>Player Information</p>
          </div>
          <div />
          <div>
            <PlayerInfo />
          </div>
        </div>
    <div className=' bg-default-50' style={{ border: "1px solid rgba(177, 158, 191, 0.2)"}}>
      <div>
        <p>Chat Bar</p>
      </div>
      <div>
        <div style={{ height: "350px", overflowY: "scroll" }}>

            <div aria-label="Example static collection table">
          <div>
            <div>NAME</div>
            <div>ROLE</div>
            <div>STATUS</div>
          </div>
          <div>
            <div key="1">
              <div>Tony Reichert</div>
              <div>CEO</div>
              <div>Active</div>
            </div>
            <div key="2">
              <div>Zoey Lang</div>
              <div>Technical Lead</div>
              <div>Paused</div>
            </div>
            <div key="3">
              <div>Jane Fisher</div>
              <div>Senior Developer</div>
              <div>Active</div>
            </div>
            <div key="4">
              <div>William Howard</div>
              <div>Community Manager</div>
              <div>Vacation</div>
            </div>
          </div>
        </div>
        </div>
        <div className='flex gap-1'>
          <input
            placeholder="you@example.com"
            type="text"
          />
          <div color='primary' >
            Send
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
