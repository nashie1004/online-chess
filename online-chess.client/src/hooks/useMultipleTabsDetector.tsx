import { useContext, useEffect } from 'react'
import useLocalStorage from './useLocalStorage';
import { Controller } from 'react-hook-form';
import useNotificationContext from './useNotificationContext';
import { useLocation } from 'react-router';

export default function useMultipleTabsDetector() {
    const { setValue: setOneTab, data: oneTab } = useLocalStorage("playPageHasMultipleTabs", "false");
    const { setNotificationState, notificationState } = useNotificationContext();
    const urlLocation = useLocation();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        addEventListener("visibilitychange", () => {

            if (notificationState.hasAGameOnGoing && urlLocation.pathname !== "/play"){
                setNotificationState({ type: "SET_HASMULTIPLETABSOPENED", payload: true });
            }

        }, { signal });

        return () => {
            controller.abort();
        };
    }, []);

    return { setOneTab, oneTab };
}
