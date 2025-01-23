using System;
using System.Threading;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Commands;
public class CreateRegistrationRequestCommandHandler : ICommandHandler<CreateRegistrationRequestCommand, RegistrationRequest>
{
    private readonly IRegistrationRequestService _registrationRequestService;

    public CreateRegistrationRequestCommandHandler(
        IRegistrationRequestService registrationRequestService
        )
    {
        _registrationRequestService = registrationRequestService;
    }

    public virtual async Task<RegistrationRequest> Handle(CreateRegistrationRequestCommand request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var details = ExType<RegistrationRequestDetails>.New();
        details.FirstName = request.FirstName;
        details.LastName = request.LastName;
        details.OrganizationName = request.OrganizationName;
        details.ContactEmail = request.ContactEmail;
        details.ContactPhone = request.ContactPhone;

        var result = await _registrationRequestService.CreateRegistrationRequest(details);

        return result;
    }
}
