using System;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceVendorModule.Core.Common;
using VirtoCommerce.MarketplaceVendorModule.StateMachine.Services;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Services;
public class RegistrationRequestService : IRegistrationRequestService
{
    private readonly IRegistrationRequestCrudService _registrationRequestCrudService;
    private readonly IStateMachineDefinitionService _stateMachineDefinitionService;
    private readonly IStateMachineInstanceService _stateMachineInstanceService;

    public RegistrationRequestService(
        IRegistrationRequestCrudService registrationRequestCrudService,
        IStateMachineDefinitionService stateMachineDefinitionService,
        IStateMachineInstanceService stateMachineInstanceService
        )
    {
        _registrationRequestCrudService = registrationRequestCrudService;
        _stateMachineDefinitionService = stateMachineDefinitionService;
        _stateMachineInstanceService = stateMachineInstanceService;
    }

    public virtual async Task<RegistrationRequest> CreateRegistrationRequest(RegistrationRequestDetails registrationRequestDetails)
    {
        var registrationRequest = ExType<RegistrationRequest>.New();
        registrationRequest.Id = Guid.NewGuid().ToString();
        registrationRequest.FirstName = registrationRequestDetails.FirstName;
        registrationRequest.LastName = registrationRequestDetails.LastName;
        registrationRequest.OrganizationName = registrationRequestDetails.OrganizationName;
        registrationRequest.ContactEmail = registrationRequestDetails.ContactEmail;
        registrationRequest.ContactPhone = registrationRequestDetails.ContactPhone;

        //Create state machine instance for registration request
        var customerOrderStateMachineDefinition = await _stateMachineDefinitionService.GetActiveStateMachineDefinitionAsync(ModuleConstants.StateMachineObjectType.RegistrationRequest);
        if (customerOrderStateMachineDefinition != null)
        {
            var stateMachineInstance = await _stateMachineInstanceService.CreateStateMachineInstanceAsync(customerOrderStateMachineDefinition.Id, null, registrationRequest);
            registrationRequest.Status = stateMachineInstance.CurrentStateName;
        }

        await _registrationRequestCrudService.SaveChangesAsync([registrationRequest]);

        return registrationRequest;
    }
}
