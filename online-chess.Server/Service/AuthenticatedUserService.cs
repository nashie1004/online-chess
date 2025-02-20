using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class AuthenticatedUserService
{
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
        var removed = _connectionIdToIdentityName.TryRemove(userConnectionId, out string? identityUserName);
        _identityNameToConnectionId.TryRemove(identityUserName ?? string.Empty, out string? _);

        return removed;
    }
    
    // public bool RemoveWithIdentityUsername(string identityUserName){
    //     string connectionId = this.GetConnectionId(identityUserName);
    //     return _connectionIdToIdentityName.TryRemove(connectionId, out string? res);
    // }

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
