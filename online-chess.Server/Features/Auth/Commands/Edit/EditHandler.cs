using System;
using MediatR;
using online_chess.Server.Persistence;

namespace online_chess.Server.Features.Auth.Commands.Edit;

public class EditHandler : IRequestHandler<EditRequest, EditResponse>
{
    private readonly UserIdentityDbContext _userIdentityDbContext;

    public EditHandler(UserIdentityDbContext userIdentityDbContext)
    {
        _userIdentityDbContext = userIdentityDbContext;
    }

    public async Task<EditResponse> Handle(EditRequest req, CancellationToken ct){
        var retVal = new EditResponse();

        try{
            // TODO
        } 
        catch (Exception err){
            retVal.ValidationErrors.Add(err.Message);
        }

        return retVal;
    }
}
