using System;
using MediatR;

namespace online_chess.Server.Features.Auth.Commands.Edit;

public class EditRequest : IRequest<EditResponse>
{
    public string OldUserName { get; set; }
    public string NewUserName { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}
