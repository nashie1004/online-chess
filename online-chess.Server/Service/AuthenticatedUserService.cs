using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class AuthenticatedUserService
{
    private static ConcurrentDictionary<string, string> _identityNameToConnectionId = new();

    public AuthenticatedUserService()
    {
        
    }

    public void Add(string userConnectionId, string identityUserName)
    {
        _identityNameToConnectionId.AddOrUpdate(identityUserName, userConnectionId, (key, oldValue) => userConnectionId);
    }

    public bool RemoveWithIdentityUsername(string identityUserName){
        var removedName = _identityNameToConnectionId.TryRemove(identityUserName, out string? userConnectionId);

        return removedName;
    }

    public string? GetConnectionId(string userIdentityName){
        _identityNameToConnectionId.TryGetValue(userIdentityName, out string? userConnectionId);
        
        return userConnectionId;
    }

    public ConcurrentDictionary<string, string> GetAll(){
        return _identityNameToConnectionId;
    }

}
