using online_chess.Server.Enums;

namespace online_chess.Server.Models.Play
{
    public class CaptureInfo
    {
        public Enums.Capture CaptureType { get; set; }
        public BaseMoveInfo? EnPassantCapturedPiece { get; set; }
    }
}
