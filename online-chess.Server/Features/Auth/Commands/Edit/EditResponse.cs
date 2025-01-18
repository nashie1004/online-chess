using System;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Commands.Edit;

public class EditResponse : BaseResponse
{
    public string NewUsername { get; set; }
}
