using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class AuthenticatedUserService
{
    private static ConcurrentDictionary<string, string> _identityNameToConnectionId = new();
    private static ConcurrentDictionary<string, string> _connectionIdToIdentityName = new();

    public AuthenticatedUserService()
    {
        
    }

    public void Add(string userConnectionId, string identityUserName)
    {
        _identityNameToConnectionId.AddOrUpdate(identityUserName, userConnectionId, (key, oldValue) => userConnectionId);
        _connectionIdToIdentityName.AddOrUpdate(userConnectionId, identityUserName, (key, oldValue) => identityUserName);
    }

    public bool RemoveWithIdentityUsername(string identityUserName){
        var removedName = _identityNameToConnectionId.TryRemove(identityUserName, out string? userConnectionId);
        var removedConnection = _connectionIdToIdentityName.TryRemove(userConnectionId ?? string.Empty, out string? _);
        
        return removedName && removedConnection;
    }

    public string? GetConnectionId(string userIdentityName){
        _identityNameToConnectionId.TryGetValue(userIdentityName, out string? userConnectionId);

        return userConnectionId;
    }

    public ConcurrentDictionary<string, string> GetAll(){
        return _connectionIdToIdentityName;
    }

}
