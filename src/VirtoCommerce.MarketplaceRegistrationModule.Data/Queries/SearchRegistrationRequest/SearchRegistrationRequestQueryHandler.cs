using System;
using System.Threading;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
public class SearchRegistrationRequestQueryHandler : IQueryHandler<SearchRegistrationRequestQuery, SearchRegistrationRequestResult>
{
    private readonly IRegistrationRequestSearchService _registrationRequestSearchService;

    public SearchRegistrationRequestQueryHandler(
        IRegistrationRequestSearchService registrationRequestSearchService
        )
    {
        _registrationRequestSearchService = registrationRequestSearchService;
    }

    public virtual async Task<SearchRegistrationRequestResult> Handle(SearchRegistrationRequestQuery request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var result = await _registrationRequestSearchService.SearchAsync(request);

        return result;
    }
}
