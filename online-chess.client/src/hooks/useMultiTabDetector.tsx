import { useEffect, useState } from "react";
import useNotificationContext from "./useNotificationContext";

export default function useMultipleTabsDetector(init: boolean) {
    const { setNotificationState } = useNotificationContext();
    const TAB_KEY = "open_tabs";
    const tabId = generateId(); // Unique ID for this tab
    const [tabCount, setTabCount] = useState(1);

    // 🔹 Function to generate a unique tab ID
    function generateId() {
        return crypto.randomUUID();
    }

    // 🚀 Register this tab in localStorage
    function registerTab() {
        const tabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
        if (!tabs.includes(tabId)) {
            tabs.push(tabId);
        }
        localStorage.setItem(TAB_KEY, JSON.stringify(tabs));
        updateTabCount();
    }

    // 🛑 Remove this tab when it closes
    function unregisterTab() {
        const tabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]").filter(id => id !== tabId);
        localStorage.setItem(TAB_KEY, JSON.stringify(tabs));
        updateTabCount();
    }

    // 🔄 Listen for storage changes (detects other tabs opening/closing)
    useEffect(() => {
        const onStorageUpdate = (event: StorageEvent) => {
            if (event.key === TAB_KEY) {
                updateTabCount();
            }
        };

        registerTab();
        window.addEventListener("storage", onStorageUpdate);
        window.addEventListener("beforeunload", unregisterTab);

        return () => {
            unregisterTab();
            window.removeEventListener("storage", onStorageUpdate);
            window.removeEventListener("beforeunload", unregisterTab);
        };
    }, []);

    // 🔍 Update tab count and notification state
    function updateTabCount() {
        const tabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
        setTabCount(tabs.length);
        setNotificationState({ type: "SET_HASMULTIPLETABSOPENED", payload: tabs.length > 1 });
    }

    return [tabCount];
}
