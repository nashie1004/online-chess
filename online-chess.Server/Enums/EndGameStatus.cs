namespace online_chess.Server.Enums
{
    public enum EndGameStatus : short
    {
        CreatorIsCheckmated,
        CreatorResigned,
        CreatorTimeIsUp,

        JoinerIsCheckmated,
        JoinerResigned,
        JoinerTimeIsUp,

        DrawByAgreement,
        DrawByStalemate,
        DrawBothPlayerDisconnected,
        DrawBy50MoveRule,
        DrawByThreeFoldRepetition,
        DrawByInsufficientMaterial
    }
}
