using System;
using System.Threading;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Commands;
public class UpdateRegistrationRequestCommandHandler : ICommandHandler<UpdateRegistrationRequestCommand, RegistrationRequest>
{
    private readonly IRegistrationRequestCrudService _registrationRequestCrudService;

    public UpdateRegistrationRequestCommandHandler(
        IRegistrationRequestCrudService registrationRequestCrudService
        )
    {
        _registrationRequestCrudService = registrationRequestCrudService;
    }

    public virtual async Task<RegistrationRequest> Handle(UpdateRegistrationRequestCommand request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrEmpty(request.Id))
        {
            throw new ArgumentException(nameof(request.Id));
        }

        var registrationRequest = await _registrationRequestCrudService.GetByIdAsync(request.Id);
        if (registrationRequest != null)
        {
            registrationRequest.DeclineReason = request.Comment;
            await _registrationRequestCrudService.SaveChangesAsync([registrationRequest]);
        }

        return registrationRequest;
    }
}
