using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
public class SearchRegistrationRequestCriteria : SearchCriteriaBase
{
    public string ContactEmail { get; set; }
    public string[] Statuses { get; set; }
}
