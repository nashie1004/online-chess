export const MAIN_PAGE_HANDLERS = {
    ON_GET_USER_CONNECTION_ID: "onGetUserConnectionId"
    ,ON_GENERIC_ERROR: "onGenericError"
    ,ON_HAS_A_GAME_IN_PROGRESS: "onHasAGameInProgress"
};

export const LIST_HANDLERS = {
    ON_GET_GAME_HISTORY: "onGetGameHistory"
    ,ON_GET_LEADERBOARD: "onGetLeaderboard"
    ,ON_GET_GAME_TYPE_LIST: "onGetGameTypeList"
    ,ON_GET_GAME_TYPE_LIST_CLASSICAL: "onGetGameTypeList_Classical"
    ,ON_GET_GAME_TYPE_LIST_BLITZ_3_MINS: "onGetGameTypeList_Blitz3Mins"
    ,ON_GET_GAME_TYPE_LIST_BLITZ_5_MINS: "onGetGameTypeList_Blitz5Mins"
    ,ON_GET_GAME_TYPE_LIST_RAPID_10_MINS: "onGetGameTypeList_Rapid10Mins"
    ,ON_GET_GAME_TYPE_LIST_RAPID_25_MINS: "onGetGameTypeList_Rapid25Mins"
};

export const LOBBY_PAGE_HANDLERS = {
    ON_REFRESH_ROOM_LIST: "onRefreshRoomList"
    ,ON_GET_ROOM_KEY: "onGetRoomKey"
    ,ON_MATCH_FOUND: "onMatchFound"
}

export const PLAY_PAGE_HANDLERS = {
    ON_INITIALIZE_GAME_INFO: "onInitializeGameInfo"
    ,ON_GAME_OVER: "onGameOver"
    ,ON_RECEIVER_MESSAGES: "onReceiveMessages"
    ,ON_RECEIVE_MOVE_HISTORY: "onReceiveMoveHistory"
    ,ON_RECEIVE_CAPTURE_HISTORY: "onReceiveCaptureHistory"
    ,ON_UPDATE_BOARD: "onUpdateBoard"
    ,ON_OPPONENT_DRAW_REQUEST: "onOpponentDrawRequest"
    ,ON_DECLINE_DRAW: "onDeclineDraw"
    ,ON_UPDATE_TIMER: "onUpdateTimer"
    ,ON_SET_PROMOTION_PREFERENCE: "onSetPromotionPreference"
}
