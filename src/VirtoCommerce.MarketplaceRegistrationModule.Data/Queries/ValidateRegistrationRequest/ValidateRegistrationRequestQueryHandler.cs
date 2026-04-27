using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation.Results;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Validators;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;
using VirtoCommerce.MarketplaceVendorModule.Core.Domains;
using VirtoCommerce.MarketplaceVendorModule.Data.Validators;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
public class ValidateRegistrationRequestQueryHandler : IQueryHandler<ValidateRegistrationRequestQuery, ValidationFailure[]>
{
    private readonly RegistrationRequestValidatorBase _registrationRequestValidator;
    private readonly SellerValidator _sellerValidator;

    public ValidateRegistrationRequestQueryHandler(
        RegistrationRequestValidatorBase registrationRequestValidator,
        SellerValidator sellerValidator
        )
    {
        _registrationRequestValidator = registrationRequestValidator;
        _sellerValidator = sellerValidator;
    }

    public virtual async Task<ValidationFailure[]> Handle(ValidateRegistrationRequestQuery request, CancellationToken cancellationToken)
    {
        var registrationRequestResult = await _registrationRequestValidator.ValidateAsync(request.RegistrationRequest, cancellationToken);
        var seller = Seller.CreateNew(request.RegistrationRequest.OrganizationName, null);
        var sellerResult = await _sellerValidator.ValidateAsync(seller, cancellationToken);
        var result = registrationRequestResult.Errors?.Concat(sellerResult.Errors?.ToArray());
        return result?.ToArray();
    }
}
