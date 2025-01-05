using MediatR;

namespace online_chess.Server.Features.Auth.Queries.GetPlayerInfo
{
    public class GetPlayerInfoHandler : IRequestHandler<GetPlayerInfoRequest, GetPlayerInfoResponse>
    {
        private IHttpContextAccessor _httpContextAccessor;

        public GetPlayerInfoHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<GetPlayerInfoResponse> Handle(GetPlayerInfoRequest req, CancellationToken ct)
        {
            var retVal = new GetPlayerInfoResponse();

            try
            {
                var user = _httpContextAccessor.HttpContext?.User;

                if (user != null) {
                    retVal.UserName = user.Identity?.Name ?? string.Empty;
                }
            }
            catch (Exception ex) { 
                retVal.ValidationErrors.Add(ex.Message);
            }
            
            return retVal;
        }
    }
}
