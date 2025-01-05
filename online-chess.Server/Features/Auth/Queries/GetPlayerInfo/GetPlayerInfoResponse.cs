using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Queries.GetPlayerInfo
{
    public class GetPlayerInfoResponse : BaseResponse
    {
        public string UserName { get; set; }
    }
}
