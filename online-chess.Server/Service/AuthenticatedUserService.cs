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

    public string? RemoveOne(string userConnectionId){
        _authenticatedUsers.Remove(userConnectionId, out string? identityUserName);
        return identityUserName;
    }

    public string? GetOne(string userConnectionId){
        _authenticatedUsers.TryGetValue(userConnectionId, out string? identityUserName);
        return identityUserName;
    }

    public ConcurrentDictionary<string, string> GetAll(){
        return _authenticatedUsers;
    }

}
