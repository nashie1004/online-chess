import { useEffect, useLayoutEffect, useRef } from "react"
import { GameOver } from "./game/scenes/GameOver";
import { MainGame } from "./game/scenes/MainGame";

export default function App(){
    const gameRef = useRef<Phaser.Game | null>();

    useEffect(() => {
        if (!gameRef.current){
            gameRef.current = new Phaser.Game({
                type: Phaser.AUTO,
                width: 768,
                height: 768,
                parent: 'game-container',
                backgroundColor: '#028af8',
                scene: [ MainGame ]
            });
        }

        return () => {
            if (gameRef.current){
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [])
 
    return <div className="game-container" id="game-container"> 

    </div>
}