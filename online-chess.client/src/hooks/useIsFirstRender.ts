import { useRef } from "react"

export default function useIsFirstRender() {
    const ref = useRef(true);
    let isFirstRender = ref.current;

    if (isFirstRender) {
        isFirstRender = false;
        return true; // First render
    }

    return isFirstRender;
}