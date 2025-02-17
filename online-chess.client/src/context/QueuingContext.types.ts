export interface IQueuingContext {
    queuingRoomKey: string | null;
    setQueuingRoomKey: React.Dispatch<React.SetStateAction<string | null>>;
}
