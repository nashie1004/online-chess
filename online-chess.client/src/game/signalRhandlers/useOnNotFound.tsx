import { useCallback } from "react";
import { useNavigate } from "react-router";

export default function useOnNotFound(){
    const navigate = useNavigate();

    const onNotFound = useCallback(() => {
        navigate("/notFound");
    }, []);

    return onNotFound;
}