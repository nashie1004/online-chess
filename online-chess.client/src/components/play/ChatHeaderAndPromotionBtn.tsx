import useGameContext from "../../hooks/useGameContext"

export default function ChatHeaderAndPromotionBtn() {
  const { setGameState } = useGameContext();

  return (
    <div className='hstack justify-content-between ps-2 sidebar-bar'>
      <div>
        <i className="bi bi-chat-fill ps-2" style={{color: "#A8A8A7", fontSize: "1.5rem"}}></i>
        <span style={{ color: "#F5F5F5"}}>&nbsp; Chat</span>
      </div>
      <div>
        <span className='text-white'>Promote to</span>
        <button 
          onClick={() => {
            setGameState({ type: "SET_MYINFO_OPENPROMOTIONMODAL", payload: true });
          }}
          className='btn btn-2'>Pawn</button>
      </div>
    </div>
  )
}
