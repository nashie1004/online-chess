import { useContext } from 'react'
import { phaserContext } from '../context/PhaserContext'

export default function usePhaser() {
  return useContext(phaserContext);
}
