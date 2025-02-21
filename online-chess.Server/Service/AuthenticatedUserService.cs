using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class AuthenticatedUserService
{
    // TODO as of 2/21/2025 8:52AM, may need to use a list?
    /* UserConnectionId, IdentityUserName */
    private static ConcurrentDictionary<string, string> _connectionIdToIdentityName = new();
    
    /* IdentityUserName, UserConnectionId */
    private static ConcurrentDictionary<string, string> _identityNameToConnectionId = new();

    public AuthenticatedUserService()
    {
        
    }

    public void Add(string userConnectionId, string identityUserName){

        // This just makes sure that each identity user name has only one connection id
        _identityNameToConnectionId.TryGetValue(identityUserName, out string? oldConnectionId);
        _connectionIdToIdentityName.TryRemove(oldConnectionId ?? string.Empty, out string? _);

        _identityNameToConnectionId.AddOrUpdate(identityUserName, userConnectionId, (key, oldValue) => userConnectionId);
        _connectionIdToIdentityName.TryAdd(userConnectionId, identityUserName);

    }

    public bool RemoveWithConnectionId(string userConnectionId){
        // var removed = _connectionIdToIdentityName.TryRemove(userConnectionId, out string? identityUserName);
        // _identityNameToConnectionId.TryRemove(identityUserName ?? string.Empty, out string? _);

        return _connectionIdToIdentityName.TryRemove(userConnectionId, out string? _);
    }
    
    public bool RemoveWithIdentityUsername(string identityUserName){
        return _identityNameToConnectionId.TryRemove(identityUserName, out string? __);
    }

    public string? GetIdentityName(string userConnectionId){
        _connectionIdToIdentityName.TryGetValue(userConnectionId, out string? identityUserName);
        return identityUserName;
    }

    public string? GetConnectionId(string userIdentityName){
        var found = _identityNameToConnectionId.TryGetValue(userIdentityName, out string? connectionId);

        return connectionId;

        //var record = _connectionIdToIdentityName.FirstOrDefault(i => i.Value == userIdentityName);
        //if (record == null) return string.Empty;
        //return record.Key == null ? string.Empty : record.Key;
    }

    public ConcurrentDictionary<string, string> GetAll(){
        return _connectionIdToIdentityName;
    }

}
