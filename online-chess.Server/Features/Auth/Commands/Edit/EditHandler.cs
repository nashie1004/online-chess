using System;
using MediatR;
using Microsoft.AspNetCore.Identity;
using online_chess.Server.Models.Entities;
using online_chess.Server.Persistence;
using online_chess.Server.Service.FileStorageService;

namespace online_chess.Server.Features.Auth.Commands.Edit;

public class EditHandler : IRequestHandler<EditRequest, EditResponse>
{
    private readonly UserIdentityDbContext _userIdentityDbContext;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IFileStorageService _fileStorageService;
    private readonly MainDbContext _mainDbContext;

    public EditHandler(
        UserIdentityDbContext userIdentityDbContext
        , UserManager<User> userManager
        , SignInManager<User> signInManager
        , IFileStorageService fileStorageService
        , MainDbContext mainDbContext
        )
    {
        _userIdentityDbContext = userIdentityDbContext;
        _userManager = userManager;
        _signInManager = signInManager;
        _fileStorageService = fileStorageService;
        _mainDbContext = mainDbContext;
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

            // existing username
            var existingName = await _userManager.FindByNameAsync(req.NewUsername); 
            if (existingName != null)
            {
                retVal.ValidationErrors.Add("Username already exists");
                return retVal;
            }

            // edit password
            var res = await _userManager.ChangePasswordAsync(user, req.OldPassword, req.NewPassword);
            if (!res.Succeeded){
                retVal.ValidationErrors.AddRange(res.Errors.Select(i => i.Description).ToList());
                return retVal;
            }

            retVal.SuccessMessage = "Password edited successfully. ";

            // edit username
            if (req.OldUsername != req.NewUsername)
            {
                user.UserName = req.NewUsername;
                var updateRes = await _userManager.UpdateAsync(user);
                if (updateRes.Succeeded)
                {
                    retVal.NewUsername = req.NewUsername;
                    retVal.SuccessMessage += "Username edited successfully.";
                }
                else
                {
                    retVal.ValidationErrors.Add(retVal.SuccessMessage);
                    retVal.ValidationErrors.AddRange(updateRes.Errors.Select(i => i.Description).ToList());
                }
            }

        } 
        catch (Exception err){
            retVal.ValidationErrors.Add(err.Message);
        }

        return retVal;
    }
}
