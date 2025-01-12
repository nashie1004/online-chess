using System;
using MediatR;
using online_chess.Server.Common;

namespace online_chess.Server.Features.Auth.Queries.GetGameHistory;

public class GetGameHistoryRequest : BaseRequestList, IRequest<GetGameHistoryResponse>
{

}
