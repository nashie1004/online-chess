namespace online_chess.Server.Enums
{
    public enum GamePlayStatus : short
    {
        WaitingForPlayers,
        Ongoing,
        Finished,
        CreatorDisconnected,
        JoinerDisconnected,
    }
}
