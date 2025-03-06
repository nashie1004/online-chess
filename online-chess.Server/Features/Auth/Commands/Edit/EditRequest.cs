using System;
using MediatR;

namespace online_chess.Server.Features.Auth.Commands.Edit;

public class EditRequest : IRequest<EditResponse>
{
    public string OldUsername { get; set; }
    public string NewUsername { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
    public string ProfileImageUrl { get; set; }
}
