﻿using MediatR;
using online_chess.Server.Common;
using online_chess.Server.Models.Play;

namespace online_chess.Server.Features.Game.Commands.MovePiece
{
    public class MovePieceRequest : BaseGameRequest, IRequest<Unit>
    {
        public BaseMoveInfo OldMove { get; set; }
        public BaseMoveInfo NewMove { get; set; }
        public bool HasCapture { get; set; }
    }
}
