using System.Threading;
using System.Threading.Tasks;
using FluentValidation.Results;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Validators;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries.ValidateRegistrationRequest;
public class ValidateRegistrationRequestQueryHandler : IQueryHandler<ValidateRegistrationRequestQuery, ValidationFailure[]>
{
    private readonly RegistrationRequestValidatorBase _validator;

    public ValidateRegistrationRequestQueryHandler(
        RegistrationRequestValidatorBase validator
        )
    {
        _validator = validator;
    }

    public virtual async Task<ValidationFailure[]> Handle(ValidateRegistrationRequestQuery request, CancellationToken cancellationToken)
    {
        var result = await _validator.ValidateAsync(request.RegistrationRequest, cancellationToken);
        return result.Errors?.ToArray();
    }
}
