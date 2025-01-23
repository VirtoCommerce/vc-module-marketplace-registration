using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
using VirtoCommerce.Platform.Core.GenericCrud;

namespace VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
public interface IRegistrationRequestSearchService : ISearchService<SearchRegistrationRequestCriteria, SearchRegistrationRequestResult, RegistrationRequest>
{
}

