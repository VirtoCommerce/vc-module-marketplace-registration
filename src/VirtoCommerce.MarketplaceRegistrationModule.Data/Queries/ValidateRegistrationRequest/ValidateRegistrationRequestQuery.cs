using FluentValidation.Results;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
public class ValidateRegistrationRequestQuery : IQuery<ValidationFailure[]>
{
    public RegistrationRequest RegistrationRequest { get; set; }
}
