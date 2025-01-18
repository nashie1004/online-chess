using System;
using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;

namespace online_chess.Server.Features.Auth.Commands.Edit;

public class EditHandler : IRequestHandler<EditRequest, EditResponse>
{
    private readonly UserIdentityDbContext _userIdentityDbContext;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public EditHandler(
        UserIdentityDbContext userIdentityDbContext
        , UserManager<User> userManager
        , SignInManager<User> signInManager
        )
    {
        _userIdentityDbContext = userIdentityDbContext;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<EditResponse> Handle(EditRequest req, CancellationToken ct){
        var retVal = new EditResponse();

        try{
            // incorrect or wrong old username
            var user = await _userManager.FindByNameAsync(req.OldUsername);
            if (user == null){
                retVal.ValidationErrors.Add("User not found");
                return retVal;
            }

            // edit username
            if (req.OldUsername != req.NewUsername){
                user.UserName = req.NewPassword;
                await _userManager.UpdateAsync(user);
                retVal.NewUsername = req.NewUsername;
            }

            // edit password
            var res = await _userManager.ChangePasswordAsync(user, req.OldPassword, req.NewPassword);
            if (!res.Succeeded){
                retVal.ValidationErrors.AddRange(res.Errors.Select(i => i.Description).ToList());
                return retVal;
            }

            retVal.SuccessMessage = "Profile edited successfully";
        } 
        catch (Exception err){
            retVal.ValidationErrors.Add(err.Message);
        }

        return retVal;
    }
}
