using System;

namespace online_chess.Server.Enums;

public class RoomMethods
{
    public const string onNotFound = "onNotFound";

    #region Auth
    public const string onRegister = "onRegister";
    public const string onLogin = "onLogin";
    public const string onIsSignedIn = "onIsSignedIn";
    public const string onLogout = "onLogout";
    public const string onEditAccount = "onEditAccount";
    public const string onGameHistory = "onGameHistory";
    #endregion

    #region LobbyPage
    public const string onGetRoomKey = "onGetRoomKey";
    public const string onRefreshRoomList = "onRefreshRoomList";
    public const string onMatchFound = "onMatchFound";
    public const string onInvalidRoomKey = "onInvalidRoomKey";
    #endregion

    #region PlayPage
    public const string onInitializeGameInfo = "onInitializeGameInfo";
    public const string onReceiveMessages = "onReceiveMessages";
    public const string onOpponentPieceMoved = "onOpponentPieceMoved";
    public const string onUpdateBoard = "onUpdateBoard";
    public const string onGameOver = "onGameOver";
    public const string onOpponentDrawRequest = "onOpponentDrawRequest";
    public const string onDeclineDraw = "onDeclineDraw";
    public const string onUpdateTimer = "onUpdateTimer";
    public const string onSetPromotionPreference = "onSetPromotionPreference";
    #endregion

    #region Connection
    public const string onGetUserConnectionId = "onGetUserConnectionId";
    public const string onLeaveRoom = "LeaveRoom";
    #endregion
}
