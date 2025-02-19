using System;
using System.Collections.Concurrent;

namespace online_chess.Server.Service;

public class AuthenticatedUserService
{
    /* UserConnectionId, IdentityUserName */
    private static ConcurrentDictionary<string, string> _connectionIdToIdentityName = new();
    private static ConcurrentDictionary<string, string> _identityNameToConnectionId = new();

    public AuthenticatedUserService()
    {
        
    }

    public bool Add(string userConnectionId, string identityUserName){
        var existing = _connectionIdToIdentityName.FirstOrDefault(i => i.Value == identityUserName);

        return _connectionIdToIdentityName.TryAdd(userConnectionId, identityUserName);
    }

    public bool RemoveWithConnectionId(string userConnectionId){
        return _connectionIdToIdentityName.TryRemove(userConnectionId, out string? res);
    }
    
    public bool RemoveWithIdentityUsername(string identityUserName){
        string connectionId = this.GetConnectionId(identityUserName);
        return _connectionIdToIdentityName.TryRemove(connectionId, out string? res);
    }

    public string? GetIdentityName(string userConnectionId){
        _connectionIdToIdentityName.TryGetValue(userConnectionId, out string? identityUserName);
        return identityUserName;
    }

    public string GetConnectionId(string userIdentityName){
        var record = _connectionIdToIdentityName.FirstOrDefault(i => i.Value == userIdentityName);
        //if (record == null) return string.Empty;
        return record.Key == null ? string.Empty : record.Key;
    }

    public ConcurrentDictionary<string, string> GetAll(){
        return _connectionIdToIdentityName;
    }

}
