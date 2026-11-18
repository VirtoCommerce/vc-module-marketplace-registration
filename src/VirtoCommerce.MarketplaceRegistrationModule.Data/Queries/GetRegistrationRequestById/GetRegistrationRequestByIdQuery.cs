using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
public class GetRegistrationRequestByIdQuery : IQuery<RegistrationRequest>
{
    public string Id { get; set; }
}
