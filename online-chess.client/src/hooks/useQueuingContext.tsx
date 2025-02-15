import { useContext } from 'react'
import { queuingContext } from '../context/QueuingContext';

export default function useQueuingContext() {
    const reTVal = useContext(queuingContext);
    if (!reTVal) {
        throw new Error("no react context value")
    }
    return reTVal;
}
