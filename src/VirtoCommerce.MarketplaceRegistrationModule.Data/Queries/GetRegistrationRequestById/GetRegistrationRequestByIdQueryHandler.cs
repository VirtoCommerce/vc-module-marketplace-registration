using System;
using System.Threading;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Queries;
public class GetRegistrationRequestByIdQueryHandler : IQueryHandler<GetRegistrationRequestByIdQuery, RegistrationRequest>
{
    private readonly IRegistrationRequestCrudService _registrationRequestCrudService;

    public GetRegistrationRequestByIdQueryHandler(
        IRegistrationRequestCrudService registrationRequestCrudService
        )
    {
        _registrationRequestCrudService = registrationRequestCrudService;
    }

    public virtual async Task<RegistrationRequest> Handle(GetRegistrationRequestByIdQuery request, CancellationToken cancellationToken)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrEmpty(request.Id))
        {
            throw new ArgumentException(nameof(request.Id));
        }

        var result = await _registrationRequestCrudService.GetByIdAsync(request.Id);

        return result;
    }
}
