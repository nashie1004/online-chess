import { useEffect, useState } from "react";
import useNotificationContext from "./useNotificationContext";
import { MultiTabDetection } from "../utils/multipleTabsDetector";

// From: https://github.com/uy-andrew/multi-tab-detection/blob/master/src/multi-tab-detection.ts

export default function useMultipleTabsDetector(init: boolean) {
    const { setNotificationState } = useNotificationContext();
    
    useEffect(() => {
        const detector = new MultiTabDetection();
        
        const timerId = setTimeout(() => {
            setNotificationState({ type: "SET_HASMULTIPLETABSOPENED", payload: detector.NumberOfTabsOpened > 1 });
        }, 1000);

        detector.NewTabDetectedEvent.subscribe({ next: (numOfTabs: number) => {
            setNotificationState({ type: "SET_HASMULTIPLETABSOPENED", payload: numOfTabs > 1 });
        }});

        detector.ClosedTabDetectedEvent.subscribe({ next: (numOfTabs: number) => {
            setNotificationState({ type: "SET_HASMULTIPLETABSOPENED", payload: numOfTabs > 1 });
        }});

        detector.ExistingTabDetectedEvent.subscribe({ next: () => {
            setNotificationState({ type: "SET_HASMULTIPLETABSOPENED", payload: detector.NumberOfTabsOpened > 1 });
        }});

        return () => {
            clearTimeout(timerId);
        }
    }, [init]);

    return {  };
}
