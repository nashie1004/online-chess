import useGameContext from "../../hooks/useGameContext"

export default function ChatHeaderAndPromotionBtn() {
  const { setGameState } = useGameContext();

  return (
    <div className='hstack justify-content-between sidebar-bar'>
      <div>
        <i 
          id="option-gear"
          style={{ color: "#A8A8A7", fontSize: "1.5rem", cursor: "pointer" }}
          className="bi bi-gear ps-2" 
          onClick={() => {
            setGameState({ type: "SET_OPENOPTIONMODAL", payload: true });
          }}
        />
      </div>
    </div>
  )
}
