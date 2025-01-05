import { useContext } from 'react'
import { authContext } from '../context/AuthContext';

export default function useAuthContext() {
    const reTVal = useContext(authContext);
    if (!reTVal) {
        throw new Error("no react context value")
    }
    return reTVal;
}
