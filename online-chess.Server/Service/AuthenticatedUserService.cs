using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class AuthenticatedUserService
{
    private static ConcurrentDictionary<string, string> _authenticatedUsers = new ConcurrentDictionary<string, string>();

    public AuthenticatedUserService()
    {
        
    }

    public void Add(string userConnectionId, string identityUserName){
        _authenticatedUsers.TryAdd(userConnectionId, identityUserName);
    }

    public string? RemoveOneWithConnectionId(string userConnectionId){
        _authenticatedUsers.Remove(userConnectionId, out string? identityUserName);
        return identityUserName;
    }

    public string? GetIdentityName(string userConnectionId){
        _authenticatedUsers.TryGetValue(userConnectionId, out string? identityUserName);
        return identityUserName;
    }

    public string GetConnectionId(string userIdentityName){
        return _authenticatedUsers.FirstOrDefault(i => i.Value == userIdentityName).Key;
    }

    public ConcurrentDictionary<string, string> GetAll(){
        return _authenticatedUsers;
    }

}
