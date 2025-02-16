using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class AuthenticatedUserService
{
    private static ConcurrentDictionary<string, string> _authenticatedUsers = new();

    public AuthenticatedUserService()
    {
        
    }

    public bool Add(string userConnectionId, string identityUserName){
        return _authenticatedUsers.TryAdd(userConnectionId, identityUserName);
    }

    public bool RemoveWithConnectionId(string userConnectionId){
        return _authenticatedUsers.TryRemove(userConnectionId, out string? res);
    }
    
    public bool RemoveWithIdentityUsername(string identityUserName){
        string connectionId = this.GetConnectionId(identityUserName);
        return _authenticatedUsers.TryRemove(connectionId, out string? res);
    }

    public string? GetIdentityName(string userConnectionId){
        _authenticatedUsers.TryGetValue(userConnectionId, out string? identityUserName);
        return identityUserName;
    }

    public string GetConnectionId(string userIdentityName){
        var record = _authenticatedUsers.FirstOrDefault(i => i.Value == userIdentityName);
        //if (record == null) return string.Empty;
        return record.Key == null ? string.Empty : record.Key;
    }

    public ConcurrentDictionary<string, string> GetAll(){
        return _authenticatedUsers;
    }

}
