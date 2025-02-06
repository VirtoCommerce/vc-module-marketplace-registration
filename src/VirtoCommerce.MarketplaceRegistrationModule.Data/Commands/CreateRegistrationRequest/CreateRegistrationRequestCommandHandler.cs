using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Validators;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Commands;
public class CreateRegistrationRequestCommandHandler : ICommandHandler<CreateRegistrationRequestCommand, RegistrationRequest>
{
    private readonly IRegistrationRequestService _registrationRequestService;
    private readonly RegistrationRequestValidatorBase _registrationRequestValidator;

    public CreateRegistrationRequestCommandHandler(
        IRegistrationRequestService registrationRequestService,
        RegistrationRequestValidatorBase registrationRequestValidator
        )
    {
        _registrationRequestService = registrationRequestService;
        _registrationRequestValidator = registrationRequestValidator;
    }

    public virtual async Task<RegistrationRequest> Handle(CreateRegistrationRequestCommand request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var registrationRequest = ExType<RegistrationRequest>.New();
        registrationRequest.FirstName = request.FirstName;
        registrationRequest.LastName = request.LastName;
        registrationRequest.OrganizationName = request.OrganizationName;
        registrationRequest.ContactEmail = request.ContactEmail;
        registrationRequest.ContactPhone = request.ContactPhone;

        await _registrationRequestValidator.ValidateAndThrowAsync(registrationRequest, cancellationToken);

        var result = await _registrationRequestService.CreateRegistrationRequest(registrationRequest);

        return result;
    }
}
