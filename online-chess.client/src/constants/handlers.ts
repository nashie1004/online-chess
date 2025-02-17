export const mainPageHandlers = {
    onGetUserConnectionId: "onGetUserConnectionId"
    ,onGenericError: "onGenericError"
    ,onHasAGameInProgress: "onHasAGameInProgress"
};

export const listHandlers = {
    onGetGameHistory: "onGetGameHistory"
    ,onGetLeaderboard: "onGetLeaderboard"
    ,onGetGameTypeList: "onGetGameTypeList"
    ,onGetGameTypeListClassical: "onGetGameTypeList_Classical"
    ,onGetGameTypeListBlitz3Mins: "onGetGameTypeList_Blitz3Mins"
    ,onGetGameTypeListBlitz5Mins: "onGetGameTypeList_Blitz5Mins"
    ,onGetGameTypeListRapid10Mins: "onGetGameTypeList_Rapid10Mins"
    ,onGetGameTypeListRapid25Mins: "onGetGameTypeList_Rapid25Mins"
};

export const lobbyPageHandlers = {
    onRefreshRoomList: "onRefreshRoomList"
    ,onGetRoomKey: "onGetRoomKey"
    ,onMatchFound: "onMatchFound"
}

export const playPageHandlers = {
    onInitializeGameInfo: "onInitializeGameInfo"
    ,onGameOver: "onGameOver"
    ,onReceiveMessages: "onReceiveMessages"
    ,onUpdateBoard: "onUpdateBoard"
    ,onOpponentDrawRequest: "onOpponentDrawRequest"
    ,onDeclineDraw: "onDeclineDraw"
    ,onUpdateTimer: "onUpdateTimer"
    ,onSetPromotionPreference: "onSetPromotionPreference"
}
